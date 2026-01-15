"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const Service_1 = require("./Service");
const AuthorizationService_1 = require("./AuthorizationService");
const bcrypt = require("bcryptjs");
class AuthenticationService extends Service_1.Service {
    async logout(token) {
        await new AuthorizationService_1.AuthorizationService().authorize(token);
        await this.authTokens.deleteToken(token);
    }
    async login(alias, password) {
        const dbUser = await this.users.getUser(alias);
        if (!dbUser) {
            throw new Error("bad-request: Invalid alias or password");
        }
        const valid = await bcrypt.compare(password, dbUser.passwordHash);
        if (!valid) {
            throw new Error("bad-request: Invalid alias or password");
        }
        const user = new tweeter_shared_1.User(dbUser.firstName, dbUser.lastName, dbUser.alias, dbUser.imageUrl);
        const expiration = Date.now() + 1000 * 60 * 60;
        const issuedAt = Date.now();
        const token = await this.authTokens.createToken(user.alias, expiration);
        const authToken = new tweeter_shared_1.AuthToken(token, issuedAt);
        return [user.dto, authToken];
    }
    async register(firstName, lastName, alias, password, userImageBase64, imageFileExtension) {
        console.log("[AuthService Server] Received base64 length:", userImageBase64?.length || 0);
        const passwordHash = await bcrypt.hash(password, 10);
        const imageUrl = await this.images.uploadProfileImage(`${alias}-profile-image.${imageFileExtension}`, userImageBase64);
        console.log("[AuthService Server] Image uploaded to:", imageUrl);
        await this.users.createUser(alias, firstName, lastName, passwordHash, imageUrl);
        const user = new tweeter_shared_1.User(firstName, lastName, alias, imageUrl);
        const expiration = Date.now() + 1000 * 60 * 60; // 1 hour
        const issuedAt = Date.now();
        const token = await this.authTokens.createToken(user.alias, expiration);
        const authToken = new tweeter_shared_1.AuthToken(token, issuedAt);
        return [user.dto, authToken];
    }
}
exports.AuthenticationService = AuthenticationService;
