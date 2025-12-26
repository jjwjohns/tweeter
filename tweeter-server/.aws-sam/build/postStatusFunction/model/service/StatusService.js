"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const Service_1 = require("./Service");
const AuthorizationService_1 = require("./AuthorizationService");
class StatusService extends Service_1.Service {
    authorizationService = new AuthorizationService_1.AuthorizationService();
    async loadMoreFeedItems(token, userAlias, pageSize, lastItem) {
        await this.authorizationService.authorize(token);
        return this.getFakeData(lastItem, pageSize);
    }
    async loadMoreStoryItems(token, userAlias, pageSize, lastItem) {
        await this.authorizationService.authorize(token);
        return this.getFakeData(lastItem, pageSize);
    }
    async postStatus(token, newStatus) {
        await this.authorizationService.authorize(token);
        await new Promise((f) => setTimeout(f, 500));
        return { success: true, message: "Status posted successfully." };
    }
    async getFakeData(lastItem, pageSize) {
        const [items, hasMore] = tweeter_shared_1.FakeData.instance.getPageOfStatuses(tweeter_shared_1.Status.getStatusFromDto(lastItem), pageSize);
        const dtos = items.map((status) => status.dto);
        return [dtos, hasMore];
    }
}
exports.StatusService = StatusService;
