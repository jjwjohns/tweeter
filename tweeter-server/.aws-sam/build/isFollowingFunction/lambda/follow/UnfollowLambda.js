"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const FollowService_1 = require("../../model/service/FollowService");
const handler = async (request) => {
    const followService = new FollowService_1.FollowService();
    const [followerCount, followeeCount] = await followService.unfollow(request.token, request.selectedUser);
    return {
        success: true,
        message: "Unfollow successful",
        followerCount,
        followeeCount,
    };
};
exports.handler = handler;
