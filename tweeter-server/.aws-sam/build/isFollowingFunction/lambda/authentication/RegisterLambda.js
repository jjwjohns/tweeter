"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const AuthenticationService_1 = require("../../model/service/AuthenticationService");
const DAOFactory_1 = require("../../factory/DAOFactory");
const DynamoDAOFactory_1 = require("../../factory/DynamoDAOFactory");
if (!DAOFactory_1.DAOFactory.instance) {
    DAOFactory_1.DAOFactory.init(new DynamoDAOFactory_1.DynamoDAOFactory());
}
const handler = async (request) => {
    const authenticationService = new AuthenticationService_1.AuthenticationService();
    if (!request.firstName || request.firstName.trim() === "") {
        throw new Error("bad-request: First name cannot be empty");
    }
    if (!request.lastName || request.lastName.trim() === "") {
        throw new Error("bad-request: Last name cannot be empty");
    }
    console.log("[RegisterLambda] Received base64 length:", request.userImageBase64?.length || 0);
    const [userDto, token] = await authenticationService.register(request.firstName, request.lastName, request.alias, request.password, request.userImageBase64, request.imageFileExtension);
    return {
        success: true,
        message: "Registration successful",
        user: userDto,
        token: token.token,
    };
};
exports.handler = handler;
