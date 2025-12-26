import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";

import { getDynamoClient } from "./DynamoClient";
import { StoryDAO } from "../StoryDAO";

const STORY_TABLE = "Story";

export class DynamoStoryDAO implements StoryDAO {
  private docClient: DynamoDBDocumentClient;

  constructor() {
    this.docClient = DynamoDBDocumentClient.from(getDynamoClient());
  }

  private sanitizeLimit(limit?: number): number {
    return Math.max(1, Math.min(limit ?? 10, 100));
  }

  async addStatus(
    authorAlias: string,
    post: string,
    timestamp: number
  ): Promise<void> {
    if (!authorAlias) throw new Error("alias-required");
    if (!post) throw new Error("post-required");

    const cmd = new PutCommand({
      TableName: STORY_TABLE,
      Item: {
        authorAlias: authorAlias,
        timestamp: timestamp.toString(),
        post,
      },
    });

    await this.docClient.send(cmd);
  }

  async getStoryPage(
    authorAlias: string,
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
    if (!authorAlias) throw new Error("alias-required");

    const cmd = new QueryCommand({
      TableName: STORY_TABLE,
      KeyConditionExpression: "authorAlias = :a",
      ExpressionAttributeValues: {
        ":a": authorAlias,
      },
      Limit: this.sanitizeLimit(limit),
      ExclusiveStartKey: lastKey,
      ScanIndexForward: false, // newest first
      ProjectionExpression: "post, authorAlias, #time",
      ExpressionAttributeNames: {
        "#time": "timestamp",
      },
    });

    const res = await this.docClient.send(cmd);

    const statuses =
      res.Items?.map((i) => ({
        post: i.post as string,
        authorAlias: i.authorAlias as string,
        timestamp: parseInt(i.timestamp as string),
      })) ?? [];

    return {
      statuses,
      lastKey: res.LastEvaluatedKey,
      hasMore: !!res.LastEvaluatedKey,
    };
  }
}
