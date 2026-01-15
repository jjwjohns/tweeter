"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoAuthTokenDAO = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const crypto_1 = require("crypto");
const DynamoClient_1 = require("./DynamoClient");
const TOKEN_TABLE = "AuthTokens";
class DynamoAuthTokenDAO {
    docClient;
    constructor() {
        this.docClient = lib_dynamodb_1.DynamoDBDocumentClient.from((0, DynamoClient_1.getDynamoClient)());
    }
    async createToken(alias, expirationEpoch) {
        const token = (0, crypto_1.randomUUID)();
        const command = new lib_dynamodb_1.PutCommand({
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
    async validateToken(token) {
        const command = new lib_dynamodb_1.GetCommand({
            TableName: TOKEN_TABLE,
            Key: { token },
            ProjectionExpression: "#t, alias, expiration",
            ExpressionAttributeNames: {
                "#t": "token",
            },
        });
        const result = await this.docClient.send(command);
        if (!result.Item)
            return false;
        const record = result.Item;
        if (record.expiration <= Date.now()) {
            await this.deleteToken(token);
            return false;
        }
        return true;
    }
    async getAliasForToken(token) {
        const command = new lib_dynamodb_1.GetCommand({
            TableName: TOKEN_TABLE,
            Key: { token },
            ProjectionExpression: "#t, alias, expiration",
            ExpressionAttributeNames: {
                "#t": "token",
            },
        });
        const result = await this.docClient.send(command);
        if (!result.Item)
            return null;
        const record = result.Item;
        if (record.expiration <= Date.now()) {
            await this.deleteToken(token);
            return null;
        }
        return record.alias;
    }
    async deleteToken(token) {
        const command = new lib_dynamodb_1.DeleteCommand({
            TableName: TOKEN_TABLE,
            Key: { token },
        });
        await this.docClient.send(command);
    }
}
exports.DynamoAuthTokenDAO = DynamoAuthTokenDAO;
