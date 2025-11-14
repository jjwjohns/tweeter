"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const AuthenticationService_1 = require("../../model/service/AuthenticationService");
const handler = async (request) => {
    const authenticationService = new AuthenticationService_1.AuthenticationService();
    const [userDto, token] = await authenticationService.register(request.firstName, request.lastName, request.alias, request.password, request.userImageBytes, request.imageFileExtension);
    return {
        success: true,
        message: "Registration successful",
        user: userDto,
        token: token.token,
    };
};
exports.handler = handler;
