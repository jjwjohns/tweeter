"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowService = void 0;
const Service_1 = require("./Service");
const AuthorizationService_1 = require("./AuthorizationService");
class FollowService extends Service_1.Service {
    authorizationService = new AuthorizationService_1.AuthorizationService();
    async loadMoreFollowees(token, userAlias, pageSize, lastItem) {
        await this.authorizationService.authorize(token);
        const { aliases, hasMore } = await this.follows.getFollowees(userAlias, pageSize, lastItem
            ? {
                followerAlias: userAlias,
                followeeAlias: lastItem.alias,
            }
            : undefined);
        const dtos = await this.mapAliasesToUserDtos(aliases);
        return [dtos, hasMore];
    }
    async loadMoreFollowers(token, userAlias, pageSize, lastItem) {
        await this.authorizationService.authorize(token);
        const { aliases, hasMore } = await this.follows.getFollowers(userAlias, pageSize, lastItem
            ? {
                followeeAlias: userAlias,
                followerAlias: lastItem.alias,
            }
            : undefined);
        const dtos = await this.mapAliasesToUserDtos(aliases);
        return [dtos, hasMore];
    }
    async getIsFollowerStatus(token, user, selectedUser) {
        await this.authorizationService.authorize(token);
        const following = await this.follows.isFollowing(user.alias, selectedUser.alias);
        return following;
    }
    async getFolloweeCount(token, user) {
        await this.authorizationService.authorize(token);
        const followeeCount = await this.follows.getFolloweeCount(user.alias);
        return followeeCount;
    }
    async getFollowerCount(token, user) {
        await this.authorizationService.authorize(token);
        const followerCount = await this.follows.getFollowerCount(user.alias);
        return followerCount;
    }
    async follow(token, userToFollow) {
        await this.authorizationService.authorize(token);
        await this.follows.follow((await this.authTokens.getAliasForToken(token)), userToFollow.alias);
        const followerCount = await this.getFollowerCount(token, userToFollow);
        const followeeCount = await this.getFolloweeCount(token, userToFollow);
        return [followerCount, followeeCount];
    }
    async unfollow(token, userToUnfollow) {
        await this.authorizationService.authorize(token);
        await this.follows.unfollow((await this.authTokens.getAliasForToken(token)), userToUnfollow.alias);
        const followerCount = await this.getFollowerCount(token, userToUnfollow);
        const followeeCount = await this.getFolloweeCount(token, userToUnfollow);
        return [followerCount, followeeCount];
    }
    async mapAliasesToUserDtos(aliases) {
        const dtos = [];
        for (const alias of aliases) {
            const user = await this.users.getUser(alias);
            if (user) {
                dtos.push({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    alias: user.alias,
                    imageUrl: user.imageUrl,
                });
            }
        }
        return dtos;
    }
}
exports.FollowService = FollowService;
