import {
  BatchWriteCommand,
  DynamoDBDocumentClient,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/lib-dynamodb";

import { getDynamoClient } from "./DynamoClient";
import { FeedDAO } from "../FeedDAO";

const FEED_TABLE = "Feed";

export class DynamoFeedDAO implements FeedDAO {
  private docClient: DynamoDBDocumentClient;

  constructor() {
    this.docClient = DynamoDBDocumentClient.from(getDynamoClient());
  }

  private sanitizeLimit(limit?: number): number {
    return Math.max(1, Math.min(limit ?? 10, 100));
  }

  async getFeedPage(
    userAlias: string,
    limit: number,
    lastKey?: any
  ): Promise<{
    statuses: Array<{
      post: string;
      authorAlias: string;
      timestamp: number;
    }>;
    lastKey?: any;
    hasMore: boolean;
  }> {
    if (!userAlias) throw new Error("alias-required");

    const params: QueryCommandInput = {
      TableName: FEED_TABLE,
      KeyConditionExpression: "userAlias = :ua",
      ExpressionAttributeValues: {
        ":ua": userAlias,
      },
      Limit: this.sanitizeLimit(limit),
      ExclusiveStartKey: lastKey,
      ScanIndexForward: false, // most recent first
      ProjectionExpression: "post, userAlias, #time, authorAlias",
      ExpressionAttributeNames: {
        "#time": "timestamp",
      },
    };

    const result = await this.docClient.send(new QueryCommand(params));

    return {
      statuses:
        result.Items?.map((item) => ({
          post: item.post,
          authorAlias: item.authorAlias,
          timestamp: parseInt(item.timestamp as string),
        })) || [],
      lastKey: result.LastEvaluatedKey,
      hasMore: !!result.LastEvaluatedKey,
    };
  }
  async addStatusToFeeds(
    status: { post: string; authorAlias: string; timestamp: number },
    followerAliases: string[]
  ): Promise<void> {
    const putRequests = followerAliases.map((followerAlias) => ({
      PutRequest: {
        Item: {
          userAlias: followerAlias,
          timestamp: status.timestamp.toString(),
          post: status.post,
          authorAlias: status.authorAlias,
        },
      },
    }));

    const BATCH_SIZE = 25;
    for (let i = 0; i < putRequests.length; i += BATCH_SIZE) {
      const batch = putRequests.slice(i, i + BATCH_SIZE);
      const params = {
        RequestItems: {
          [FEED_TABLE]: batch,
        },
      };

      await this.docClient.send(new BatchWriteCommand(params));
    }
  }
}
