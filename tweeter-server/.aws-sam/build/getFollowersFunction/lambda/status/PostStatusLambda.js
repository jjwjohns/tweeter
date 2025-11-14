"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const StatusService_1 = require("../../model/service/StatusService");
const handler = async (request) => {
    const statusService = new StatusService_1.StatusService();
    const response = await statusService.postStatus(request.token, request.status);
    return response;
};
exports.handler = handler;
