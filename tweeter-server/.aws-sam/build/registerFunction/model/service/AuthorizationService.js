"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationService = void 0;
const Service_1 = require("./Service");
class AuthorizationService extends Service_1.Service {
    async authorize(token) {
        if (!token) {
            throw new Error("unauthorized: no token provided");
        }
        const valid = await this.authTokens.validateToken(token);
        if (!valid) {
            throw new Error("unauthorized: token invalid or expired");
        }
        // Optionally return alias for convenience
        const alias = await this.authTokens.getAliasForToken(token);
        if (!alias) {
            throw new Error("unauthorized: token invalid");
        }
        return alias;
    }
}
exports.AuthorizationService = AuthorizationService;
