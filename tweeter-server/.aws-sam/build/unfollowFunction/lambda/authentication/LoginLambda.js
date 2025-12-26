"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const AuthenticationService_1 = require("../../model/service/AuthenticationService");
const DAOFactory_1 = require("../../factory/DAOFactory");
const DynamoDAOFactory_1 = require("../../factory/DynamoDAOFactory");
// Initialize concrete DAOs once per cold start via the abstract factory.
if (!DAOFactory_1.DAOFactory.instance) {
    DAOFactory_1.DAOFactory.init(new DynamoDAOFactory_1.DynamoDAOFactory());
}
const handler = async (request) => {
    const authenticationService = new AuthenticationService_1.AuthenticationService();
    if (!request.alias || request.alias.trim() === "") {
        throw new Error("bad-request: Alias cannot be empty");
    }
    if (!request.password || request.password.trim() === "") {
        throw new Error("bad-request: Password cannot be empty");
    }
    const [userDto, token] = await authenticationService.login(request.alias, request.password);
    return {
        success: true,
        message: "Login successful",
        user: userDto,
        token: token.token,
    };
};
exports.handler = handler;
