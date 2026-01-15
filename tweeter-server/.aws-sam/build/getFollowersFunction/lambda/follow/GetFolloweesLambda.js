"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const FollowService_1 = require("../../model/service/FollowService");
const DAOFactory_1 = require("../../factory/DAOFactory");
const DynamoDAOFactory_1 = require("../../factory/DynamoDAOFactory");
// Initialize concrete DAOs once per cold start via the abstract factory.
if (!DAOFactory_1.DAOFactory.instance) {
    DAOFactory_1.DAOFactory.init(new DynamoDAOFactory_1.DynamoDAOFactory());
}
const handler = async (request) => {
    const followService = new FollowService_1.FollowService();
    const [items, hasMore] = await followService.loadMoreFollowees(request.token, request.userAlias, request.pageSize, request.lastItem || null);
    return {
        success: true,
        message: null,
        items: items,
        hasMore: hasMore,
    };
};
exports.handler = handler;
