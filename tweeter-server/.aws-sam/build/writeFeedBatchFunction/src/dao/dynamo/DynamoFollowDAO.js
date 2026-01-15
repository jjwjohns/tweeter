"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoFollowDAO = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const DynamoClient_1 = require("./DynamoClient");
const FOLLOW_TABLE = "Follows";
const FOLLOWER_INDEX = "FollowerIndex";
class DynamoFollowDAO {
    docClient;
    constructor() {
        this.docClient = lib_dynamodb_1.DynamoDBDocumentClient.from((0, DynamoClient_1.getDynamoClient)());
    }
    sanitizeLimit(limit) {
        return Math.max(1, Math.min(limit ?? 10, 100));
    }
    async follow(follower, followee) {
        if (!follower || !followee) {
            throw new Error("alias-required");
        }
        const cmd = new lib_dynamodb_1.PutCommand({
            TableName: FOLLOW_TABLE,
            Item: { followerAlias: follower, followeeAlias: followee },
            ConditionExpression: "attribute_not_exists(followeeAlias)",
        });
        await this.docClient.send(cmd);
    }
    async unfollow(follower, followee) {
        if (!follower || !followee) {
            throw new Error("alias-required");
        }
        const cmd = new lib_dynamodb_1.DeleteCommand({
            TableName: FOLLOW_TABLE,
            Key: { followeeAlias: followee, followerAlias: follower },
            ConditionExpression: "attribute_exists(followeeAlias)",
        });
        await this.docClient.send(cmd);
    }
    async isFollowing(follower, followee) {
        if (!follower || !followee) {
            throw new Error("alias-required");
        }
        const cmd = new lib_dynamodb_1.GetCommand({
            TableName: FOLLOW_TABLE,
            Key: { followeeAlias: followee, followerAlias: follower },
            ProjectionExpression: "followeeAlias",
        });
        const res = await this.docClient.send(cmd);
        return !!res.Item;
    }
    async getFollowers(followee, limit, lastKey) {
        if (!followee)
            throw new Error("alias-required");
        const cmd = new lib_dynamodb_1.QueryCommand({
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
        const aliases = res.Items?.map((i) => i.followerAlias) ?? [];
        return {
            aliases,
            lastKey: res.LastEvaluatedKey,
            hasMore: !!res.LastEvaluatedKey,
        };
    }
    async getAllFollowers(followee) {
        let followers = [];
        let lastKey = undefined;
        do {
            const page = await this.getFollowers(followee, 100, lastKey);
            followers = followers.concat(page.aliases);
            lastKey = page.lastKey;
        } while (lastKey);
        return followers;
    }
    async getFollowerCount(followee) {
        const cmd = new lib_dynamodb_1.QueryCommand({
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
    async getFollowees(follower, limit, lastKey) {
        if (!follower)
            throw new Error("alias-required");
        const cmd = new lib_dynamodb_1.QueryCommand({
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
        const aliases = res.Items?.map((i) => i.followeeAlias) ?? [];
        return {
            aliases,
            lastKey: res.LastEvaluatedKey,
            hasMore: !!res.LastEvaluatedKey,
        };
    }
    async getFolloweeCount(follower) {
        const cmd = new lib_dynamodb_1.QueryCommand({
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
exports.DynamoFollowDAO = DynamoFollowDAO;
