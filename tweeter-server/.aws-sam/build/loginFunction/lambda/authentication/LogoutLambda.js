"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const AuthenticationService_1 = require("../../model/service/AuthenticationService");
const handler = async (request) => {
    const authenticationService = new AuthenticationService_1.AuthenticationService();
    await authenticationService.logout(request.token);
    return {
        success: true,
        message: "Logout successful",
    };
};
exports.handler = handler;
