"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const Service_1 = require("./Service");
const AuthorizationService_1 = require("./AuthorizationService");
class UserService extends Service_1.Service {
    authorizer = new AuthorizationService_1.AuthorizationService();
    async getUser(token, alias) {
        await this.authorizer.authorize(token);
        const dbUser = await this.users.getUser(alias);
        if (!dbUser) {
            return null;
        }
        const user = new tweeter_shared_1.User(dbUser.firstName, dbUser.lastName, dbUser.alias, dbUser.imageUrl);
        return user.dto;
    }
}
exports.UserService = UserService;
