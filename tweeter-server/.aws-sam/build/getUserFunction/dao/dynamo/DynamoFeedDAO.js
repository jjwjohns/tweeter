"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoFeedDAO = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const DynamoClient_1 = require("./DynamoClient");
const FEED_TABLE = "Feed";
class DynamoFeedDAO {
    docClient;
    constructor() {
        this.docClient = lib_dynamodb_1.DynamoDBDocumentClient.from((0, DynamoClient_1.getDynamoClient)());
    }
    sanitizeLimit(limit) {
        return Math.max(1, Math.min(limit ?? 10, 100));
    }
    async getFeedPage(alias, limit, lastKey) {
        if (!alias)
            throw new Error("alias-required");
        const params = {
            TableName: FEED_TABLE,
            KeyConditionExpression: "userAlias = :ua",
            ExpressionAttributeValues: {
                ":ua": alias,
            },
            Limit: this.sanitizeLimit(limit),
            ExclusiveStartKey: lastKey,
            ScanIndexForward: false, // most recent first
            ProjectionExpression: "post, userAlias, timestamp, authorAlias",
        };
        const result = await this.docClient.send(new lib_dynamodb_1.QueryCommand(params));
        return {
            statuses: result.Items?.map((item) => ({
                post: item.post,
                userAlias: item.authorAlias,
                timestamp: item.timestamp,
            })) || [],
            lastKey: result.LastEvaluatedKey,
            hasMore: !!result.LastEvaluatedKey,
        };
    }
    async addStatusToFeeds(status, followerAliases) {
        const putRequests = followerAliases.map((followerAlias) => ({
            PutRequest: {
                Item: {
                    userAlias: followerAlias,
                    timestamp: status.timestamp,
                    post: status.post,
                    authorAlias: status.userAlias,
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
            await this.docClient.send(new lib_dynamodb_1.BatchWriteCommand(params));
        }
    }
}
exports.DynamoFeedDAO = DynamoFeedDAO;
