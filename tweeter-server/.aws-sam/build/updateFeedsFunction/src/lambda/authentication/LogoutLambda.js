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
    if (!request.token || request.token.trim() === "") {
        throw new Error("bad-request: Token cannot be empty");
    }
    await authenticationService.logout(request.token);
    return {
        success: true,
        message: "Logout successful",
    };
};
exports.handler = handler;
