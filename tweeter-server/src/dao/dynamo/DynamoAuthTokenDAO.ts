import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

import { nanoid } from "nanoid";
import { getDynamoClient } from "./DynamoClient";
import { AuthTokenDAO } from "../AuthTokenDAO";

const TOKEN_TABLE = "AuthToken";

type TokenRecord = {
  token: string;
  alias: string;
  expiration: number;
};

export class DynamoAuthTokenDAO implements AuthTokenDAO {
  private docClient: DynamoDBDocumentClient;

  constructor() {
    this.docClient = DynamoDBDocumentClient.from(getDynamoClient());
  }

  async createToken(alias: string, expirationEpoch: number): Promise<string> {
    const token = nanoid(32);

    const command = new PutCommand({
      TableName: TOKEN_TABLE,
      Item: {
        token,
        alias,
        expiration: expirationEpoch,
      },
    });

    await this.docClient.send(command);

    return token;
  }

  async validateToken(token: string): Promise<boolean> {
    const command = new GetCommand({
      TableName: TOKEN_TABLE,
      Key: { token },
      ProjectionExpression: "token, alias, expiration",
    });

    const result = await this.docClient.send(command);

    if (!result.Item) return false;

    const record = result.Item as TokenRecord;

    if (record.expiration <= Date.now()) {
      await this.deleteToken(token);
      return false;
    }

    return true;
  }

  async getAliasForToken(token: string): Promise<string | null> {
    const command = new GetCommand({
      TableName: TOKEN_TABLE,
      Key: { token },
      ProjectionExpression: "token, alias, expiration",
    });

    const result = await this.docClient.send(command);

    if (!result.Item) return null;

    const record = result.Item as TokenRecord;

    if (record.expiration <= Date.now()) {
      await this.deleteToken(token);
      return null;
    }

    return record.alias;
  }

  async deleteToken(token: string): Promise<void> {
    const command = new DeleteCommand({
      TableName: TOKEN_TABLE,
      Key: { token },
    });

    await this.docClient.send(command);
  }
}
