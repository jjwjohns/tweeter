"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const FollowService_1 = require("../../model/service/FollowService");
const DAOFactory_1 = require("../../factory/DAOFactory");
const DynamoDAOFactory_1 = require("../../factory/DynamoDAOFactory");
if (!DAOFactory_1.DAOFactory.instance) {
    DAOFactory_1.DAOFactory.init(new DynamoDAOFactory_1.DynamoDAOFactory());
}
const handler = async (request) => {
    const followService = new FollowService_1.FollowService();
    const count = await followService.getFolloweeCount(request.token, request.selectedUser);
    return {
        success: true,
        message: null,
        number: count,
    };
};
exports.handler = handler;
