import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const REGION = "us-east-1"; // change if your tables are elsewhere

let client: DynamoDBClient;

export function getDynamoClient(): DynamoDBClient {
  if (!client) {
    client = new DynamoDBClient({ region: REGION });
  }
  return client;
}
