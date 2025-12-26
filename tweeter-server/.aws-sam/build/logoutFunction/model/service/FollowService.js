"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const Service_1 = require("./Service");
const AuthorizationService_1 = require("./AuthorizationService");
class FollowService extends Service_1.Service {
    authorizationService = new AuthorizationService_1.AuthorizationService();
    async loadMoreFollowees(token, userAlias, pageSize, lastItem) {
        await this.authorizationService.authorize(token);
        return this.getFakeData(lastItem, pageSize, userAlias);
    }
    async loadMoreFollowers(token, userAlias, pageSize, lastItem) {
        await this.authorizationService.authorize(token);
        return this.getFakeData(lastItem, pageSize, userAlias);
    }
    async getIsFollowerStatus(token, user, selectedUser) {
        await this.authorizationService.authorize(token);
        return tweeter_shared_1.FakeData.instance.isFollower();
    }
    async getFolloweeCount(token, user) {
        await this.authorizationService.authorize(token);
        return tweeter_shared_1.FakeData.instance.getFolloweeCount(user.alias);
    }
    async getFollowerCount(token, user) {
        await this.authorizationService.authorize(token);
        return tweeter_shared_1.FakeData.instance.getFollowerCount(user.alias);
    }
    async follow(token, userToFollow) {
        await this.authorizationService.authorize(token);
        await new Promise((f) => setTimeout(f, 500));
        const followerCount = await this.getFollowerCount(token, userToFollow);
        const followeeCount = await this.getFolloweeCount(token, userToFollow);
        return [followerCount, followeeCount];
    }
    async unfollow(token, userToUnfollow) {
        await this.authorizationService.authorize(token);
        await new Promise((f) => setTimeout(f, 500));
        const followerCount = await this.getFollowerCount(token, userToUnfollow);
        const followeeCount = await this.getFolloweeCount(token, userToUnfollow);
        return [followerCount, followeeCount];
    }
    async getFakeData(lastItem, pageSize, userAlias) {
        const [items, hasMore] = tweeter_shared_1.FakeData.instance.getPageOfUsers(tweeter_shared_1.User.getUserFromDto(lastItem), pageSize, userAlias);
        const dtos = items.map((user) => user.dto);
        return [dtos, hasMore];
    }
}
exports.FollowService = FollowService;
