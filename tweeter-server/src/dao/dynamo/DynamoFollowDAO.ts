import {
  DynamoDBDocumentClient,
  PutCommand,
  DeleteCommand,
  QueryCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";

import { getDynamoClient } from "./DynamoClient";
import { FollowDAO } from "../FollowDAO";

const FOLLOW_TABLE = "Follows";
const FOLLOWER_INDEX = "FollowerIndex";

export class DynamoFollowDAO implements FollowDAO {
  private docClient: DynamoDBDocumentClient;

  constructor() {
    this.docClient = DynamoDBDocumentClient.from(getDynamoClient());
  }

  private sanitizeLimit(limit?: number): number {
    return Math.max(1, Math.min(limit ?? 10, 100));
  }

  async follow(follower: string, followee: string): Promise<void> {
    if (!follower || !followee) {
      throw new Error("alias-required");
    }

    const cmd = new PutCommand({
      TableName: FOLLOW_TABLE,
      Item: { followerAlias: follower, followeeAlias: followee },
      ConditionExpression: "attribute_not_exists(followeeAlias)",
    });

    await this.docClient.send(cmd);
  }

  async unfollow(follower: string, followee: string): Promise<void> {
    if (!follower || !followee) {
      throw new Error("alias-required");
    }

    const cmd = new DeleteCommand({
      TableName: FOLLOW_TABLE,
      Key: { followeeAlias: followee, followerAlias: follower },
      ConditionExpression: "attribute_exists(followeeAlias)",
    });

    await this.docClient.send(cmd);
  }

  async isFollowing(follower: string, followee: string): Promise<boolean> {
    if (!follower || !followee) {
      throw new Error("alias-required");
    }

    const cmd = new GetCommand({
      TableName: FOLLOW_TABLE,
      Key: { followeeAlias: followee, followerAlias: follower },
      ProjectionExpression: "followeeAlias",
    });

    const res = await this.docClient.send(cmd);
    return !!res.Item;
  }

  async getFollowers(
    followee: string,
    limit: number,
    lastKey?: any
  ): Promise<{ aliases: string[]; lastKey?: any; hasMore: boolean }> {
    if (!followee) throw new Error("alias-required");

    const cmd = new QueryCommand({
      TableName: FOLLOW_TABLE,
      KeyConditionExpression: "followeeAlias = :f",
      ExpressionAttributeValues: {
        ":f": followee,
      },
      Limit: this.sanitizeLimit(limit),
      ExclusiveStartKey: lastKey,
      ProjectionExpression: "followerAlias",
    });

    const res = await this.docClient.send(cmd);

    const aliases = res.Items?.map((i) => i.followerAlias as string) ?? [];

    return {
      aliases,
      lastKey: res.LastEvaluatedKey,
      hasMore: !!res.LastEvaluatedKey,
    };
  }

  async getAllFollowers(followee: string): Promise<string[]> {
    let followers: string[] = [];
    let lastKey: any = undefined;

    do {
      const page = await this.getFollowers(followee, 100, lastKey);
      followers = followers.concat(page.aliases);
      lastKey = page.lastKey;
    } while (lastKey);

    return followers;
  }

  async getFollowerCount(followee: string): Promise<number> {
    const cmd = new QueryCommand({
      TableName: FOLLOW_TABLE,
      KeyConditionExpression: "followeeAlias = :f",
      ExpressionAttributeValues: {
        ":f": followee,
      },
      Select: "COUNT",
    });

    const res = await this.docClient.send(cmd);
    return res.Count ?? 0;
  }

  async getFollowees(
    follower: string,
    limit: number,
    lastKey?: any
  ): Promise<{ aliases: string[]; lastKey?: any; hasMore: boolean }> {
    if (!follower) throw new Error("alias-required");

    const cmd = new QueryCommand({
      TableName: FOLLOW_TABLE,
      IndexName: FOLLOWER_INDEX,
      KeyConditionExpression: "followerAlias = :f",
      ExpressionAttributeValues: {
        ":f": follower,
      },
      Limit: this.sanitizeLimit(limit),
      ExclusiveStartKey: lastKey,
      ProjectionExpression: "followeeAlias",
    });

    const res = await this.docClient.send(cmd);

    const aliases = res.Items?.map((i) => i.followeeAlias as string) ?? [];

    return {
      aliases,
      lastKey: res.LastEvaluatedKey,
      hasMore: !!res.LastEvaluatedKey,
    };
  }

  async getFolloweeCount(follower: string): Promise<number> {
    const cmd = new QueryCommand({
      TableName: FOLLOW_TABLE,
      IndexName: FOLLOWER_INDEX,
      KeyConditionExpression: "followerAlias = :f",
      ExpressionAttributeValues: {
        ":f": follower,
      },
      Select: "COUNT",
    });

    const res = await this.docClient.send(cmd);
    return res.Count ?? 0;
  }
}
