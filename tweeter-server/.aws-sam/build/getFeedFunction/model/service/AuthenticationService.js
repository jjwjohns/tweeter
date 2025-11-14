"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
class AuthenticationService {
    async logout(token) {
        await new Promise((res) => setTimeout(res, 1000));
    }
    async login(alias, password) {
        const user = tweeter_shared_1.FakeData.instance.firstUser;
        if (user === null) {
            throw new Error("Invalid alias or password");
        }
        return [user.dto, tweeter_shared_1.FakeData.instance.authToken];
    }
    async register(firstName, lastName, alias, password, userImageBytes, imageFileExtension) {
        const user = tweeter_shared_1.FakeData.instance.firstUser;
        if (user === null) {
            throw new Error("Invalid registration");
        }
        return [user.dto, tweeter_shared_1.FakeData.instance.authToken];
    }
}
exports.AuthenticationService = AuthenticationService;
