"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const Service_1 = require("./Service");
const AuthorizationService_1 = require("./AuthorizationService");
class StatusService extends Service_1.Service {
    authorizationService = new AuthorizationService_1.AuthorizationService();
    async loadMoreFeedItems(token, authorAlias, pageSize, lastItem) {
        await this.authorizationService.authorize(token);
        const { statuses, lastKey, hasMore } = await this.feeds.getFeedPage(authorAlias, pageSize, lastItem
            ? {
                userAlias: authorAlias,
                timestamp: lastItem.timestamp.toString(),
            }
            : undefined);
        const dtos = await this.mapStatusesToDtos(statuses, "feed");
        return [dtos, hasMore];
    }
    async loadMoreStoryItems(token, userAlias, pageSize, lastItem) {
        await this.authorizationService.authorize(token);
        const { statuses, hasMore } = await this.stories.getStoryPage(userAlias, pageSize, lastItem
            ? {
                authorAlias: userAlias,
                timestamp: lastItem.timestamp.toString(),
            }
            : undefined);
        const dtos = await this.mapStatusesToDtos(statuses, "story");
        return [dtos, hasMore];
    }
    async postStatus(token, newStatus) {
        await this.authorizationService.authorize(token);
        if (!newStatus?.user?.alias) {
            throw new Error("bad-request: missing author alias");
        }
        const authorAlias = newStatus.user.alias;
        const timestamp = newStatus.timestamp ?? Date.now();
        await this.stories.addStatus(authorAlias, newStatus.post, timestamp);
        const followerAliases = await this.follows.getAllFollowers(authorAlias);
        await this.feeds.addStatusToFeeds({
            post: newStatus.post,
            authorAlias: authorAlias,
            timestamp,
        }, followerAliases);
        return { success: true, message: "Status posted successfully." };
    }
    async mapStatusesToDtos(statuses, context) {
        const dtos = [];
        for (const status of statuses) {
            const author = await this.users.getUser(status.authorAlias);
            if (!author) {
                throw new Error(`internal-server-error: author not found for ${context} item`);
            }
            const statusObj = new tweeter_shared_1.Status(status.post, new tweeter_shared_1.User(author.firstName, author.lastName, author.alias, author.imageUrl), status.timestamp);
            dtos.push(statusObj.dto);
        }
        return dtos;
    }
}
exports.StatusService = StatusService;
