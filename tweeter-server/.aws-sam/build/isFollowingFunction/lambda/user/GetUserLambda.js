"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const UserService_1 = require("../../model/service/UserService");
const handler = async (request) => {
    const userService = new UserService_1.UserService();
    const user = await userService.getUser(request.token, request.userAlias);
    if (!user) {
        return {
            success: false,
            message: "User not found",
            user: null,
        };
    }
    return {
        success: true,
        message: "Success",
        user: user,
    };
};
exports.handler = handler;
