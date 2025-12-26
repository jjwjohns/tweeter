"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoStoryDAO = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const DynamoClient_1 = require("./DynamoClient");
const STORY_TABLE = "Story";
class DynamoStoryDAO {
    docClient;
    constructor() {
        this.docClient = lib_dynamodb_1.DynamoDBDocumentClient.from((0, DynamoClient_1.getDynamoClient)());
    }
    sanitizeLimit(limit) {
        return Math.max(1, Math.min(limit ?? 10, 100));
    }
    async addStatus(authorAlias, post, timestamp) {
        if (!authorAlias)
            throw new Error("alias-required");
        if (!post)
            throw new Error("post-required");
        const cmd = new lib_dynamodb_1.PutCommand({
            TableName: STORY_TABLE,
            Item: {
                alias: authorAlias,
                timestamp,
                post,
                userAlias: authorAlias, // if your models expect it
            },
        });
        await this.docClient.send(cmd);
    }
    async getStoryPage(alias, limit, lastKey) {
        if (!alias)
            throw new Error("alias-required");
        const cmd = new lib_dynamodb_1.QueryCommand({
            TableName: STORY_TABLE,
            KeyConditionExpression: "alias = :a",
            ExpressionAttributeValues: {
                ":a": alias,
            },
            Limit: this.sanitizeLimit(limit),
            ExclusiveStartKey: lastKey,
            ScanIndexForward: false, // newest first
            ProjectionExpression: "post, userAlias, timestamp",
        });
        const res = await this.docClient.send(cmd);
        const statuses = res.Items?.map((i) => ({
            post: i.post,
            userAlias: i.userAlias,
            timestamp: i.timestamp,
        })) ?? [];
        return {
            statuses,
            lastKey: res.LastEvaluatedKey,
            hasMore: !!res.LastEvaluatedKey,
        };
    }
}
exports.DynamoStoryDAO = DynamoStoryDAO;
