"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const DAOFactory_1 = require("../../factory/DAOFactory");
// Base class giving services access to DAOs without knowing concrete implementations.
class Service {
    get users() {
        return DAOFactory_1.DAOFactory.instance.getUserDAO();
    }
    get authTokens() {
        return DAOFactory_1.DAOFactory.instance.getAuthTokenDAO();
    }
    get follows() {
        return DAOFactory_1.DAOFactory.instance.getFollowDAO();
    }
    get stories() {
        return DAOFactory_1.DAOFactory.instance.getStoryDAO();
    }
    get feeds() {
        return DAOFactory_1.DAOFactory.instance.getFeedDAO();
    }
    get images() {
        return DAOFactory_1.DAOFactory.instance.getImageDAO();
    }
}
exports.Service = Service;
