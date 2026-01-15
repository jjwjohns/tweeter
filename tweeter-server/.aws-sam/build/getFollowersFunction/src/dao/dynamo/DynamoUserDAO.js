"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoUserDAO = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const DynamoClient_1 = require("./DynamoClient");
const USER_TABLE = "Users";
class DynamoUserDAO {
    docClient;
    constructor() {
        this.docClient = lib_dynamodb_1.DynamoDBDocumentClient.from((0, DynamoClient_1.getDynamoClient)());
    }
    async createUser(alias, firstName, lastName, passwordHash, imageUrl) {
        if (!alias) {
            throw new Error("alias-required");
        }
        const command = new lib_dynamodb_1.PutCommand({
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
    async getUser(alias) {
        if (!alias) {
            throw new Error("alias-required");
        }
        const command = new lib_dynamodb_1.GetCommand({
            TableName: USER_TABLE,
            Key: { alias },
            ProjectionExpression: "alias, firstName, lastName, imageUrl, passwordHash, followerCount, followeeCount",
        });
        const result = await this.docClient.send(command);
        if (!result.Item) {
            return null;
        }
        return result.Item;
    }
    async updateFollowCounts(alias, followerDelta, followeeDelta) {
        if (!alias) {
            throw new Error("alias-required");
        }
        const command = new lib_dynamodb_1.UpdateCommand({
            TableName: USER_TABLE,
            Key: { alias },
            UpdateExpression: "SET followerCount = if_not_exists(followerCount, :z) + :fDelta, " +
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
exports.DynamoUserDAO = DynamoUserDAO;
