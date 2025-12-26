import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

import { getDynamoClient } from "./DynamoClient";
import { UserDAO } from "../UserDAO";

const USER_TABLE = process.env.USER_TABLE || "User"; // configurable per stage

type UserRecord = {
  alias: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  passwordHash: string;
  followerCount: number;
  followeeCount: number;
};

export class DynamoUserDAO implements UserDAO {
  private docClient: DynamoDBDocumentClient;

  constructor() {
    this.docClient = DynamoDBDocumentClient.from(getDynamoClient());
  }

  async createUser(
    alias: string,
    firstName: string,
    lastName: string,
    passwordHash: string,
    imageUrl: string
  ): Promise<void> {
    if (!alias) {
      throw new Error("alias-required");
    }

    const command = new PutCommand({
      TableName: USER_TABLE,
      Item: {
        alias,
        firstName,
        lastName,
        passwordHash,
        imageUrl,
        followerCount: 0,
        followeeCount: 0,
      },
      ConditionExpression: "attribute_not_exists(alias)",
    });

    await this.docClient.send(command);
  }

  async getUser(alias: string): Promise<{
    alias: string;
    firstName: string;
    lastName: string;
    imageUrl: string;
    passwordHash: string;
    followerCount: number;
    followeeCount: number;
  } | null> {
    if (!alias) {
      throw new Error("alias-required");
    }

    const command = new GetCommand({
      TableName: USER_TABLE,
      Key: { alias },
      ProjectionExpression:
        "alias, firstName, lastName, imageUrl, passwordHash, followerCount, followeeCount",
    });

    const result = await this.docClient.send(command);

    if (!result.Item) {
      return null;
    }

    return result.Item as UserRecord;
  }

  async updateFollowCounts(
    alias: string,
    followerDelta: number,
    followeeDelta: number
  ): Promise<void> {
    if (!alias) {
      throw new Error("alias-required");
    }

    const command = new UpdateCommand({
      TableName: USER_TABLE,
      Key: { alias },
      UpdateExpression:
        "SET followerCount = if_not_exists(followerCount, :z) + :fDelta, " +
        "followeeCount = if_not_exists(followeeCount, :z) + :foDelta",
      ExpressionAttributeValues: {
        ":fDelta": followerDelta,
        ":foDelta": followeeDelta,
        ":z": 0,
      },
      ConditionExpression: "attribute_exists(alias)",
    });

    await this.docClient.send(command);
  }
}
