"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDynamoClient = getDynamoClient;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const REGION = "us-east-1"; // change if your tables are elsewhere
let client;
function getDynamoClient() {
    if (!client) {
        client = new client_dynamodb_1.DynamoDBClient({ region: REGION });
    }
    return client;
}
