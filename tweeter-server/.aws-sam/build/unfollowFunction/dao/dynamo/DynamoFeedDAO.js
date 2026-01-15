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
    async getFeedPage(userAlias, limit, lastKey) {
        if (!userAlias)
            throw new Error("alias-required");
        const params = {
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
        const result = await this.docClient.send(new lib_dynamodb_1.QueryCommand(params));
        return {
            statuses: result.Items?.map((item) => ({
                post: item.post,
                authorAlias: item.authorAlias,
                timestamp: parseInt(item.timestamp),
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
            await this.docClient.send(new lib_dynamodb_1.BatchWriteCommand(params));
        }
    }
    async addFeedBatch(feedItems) {
        if (!feedItems || feedItems.length === 0) {
            return; // nothing to write
        }
        // Safety check: should never exceed 25 per batch from StatusService
        if (feedItems.length > 25) {
            throw new Error("bad-request: addFeedBatch cannot exceed 25 items");
        }
        const putRequests = feedItems.map((item) => ({
            PutRequest: {
                Item: {
                    userAlias: item.userAlias,
                    timestamp: item.timestamp.toString(),
                    post: item.post,
                    authorAlias: item.authorAlias,
                },
            },
        }));
        const params = {
            RequestItems: {
                [FEED_TABLE]: putRequests,
            },
        };
        await this.docClient.send(new lib_dynamodb_1.BatchWriteCommand(params));
    }
}
exports.DynamoFeedDAO = DynamoFeedDAO;
