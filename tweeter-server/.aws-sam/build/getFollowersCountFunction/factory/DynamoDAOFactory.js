"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoDAOFactory = void 0;
const DAOFactory_1 = require("./DAOFactory");
const DynamoUserDAO_1 = require("../dao/dynamo/DynamoUserDAO");
const DynamoAuthTokenDAO_1 = require("../dao/dynamo/DynamoAuthTokenDAO");
const DynamoFollowDAO_1 = require("../dao/dynamo/DynamoFollowDAO");
const DynamoStoryDAO_1 = require("../dao/dynamo/DynamoStoryDAO");
const DynamoFeedDAO_1 = require("../dao/dynamo/DynamoFeedDAO");
const S3ImageDAO_1 = require("../dao/dynamo/S3ImageDAO");
class DynamoDAOFactory extends DAOFactory_1.DAOFactory {
    getUserDAO() {
        return new DynamoUserDAO_1.DynamoUserDAO();
    }
    getAuthTokenDAO() {
        return new DynamoAuthTokenDAO_1.DynamoAuthTokenDAO();
    }
    getFollowDAO() {
        return new DynamoFollowDAO_1.DynamoFollowDAO();
    }
    getStoryDAO() {
        return new DynamoStoryDAO_1.DynamoStoryDAO();
    }
    getFeedDAO() {
        return new DynamoFeedDAO_1.DynamoFeedDAO();
    }
    getImageDAO() {
        return new S3ImageDAO_1.S3ImageDAO();
    }
}
exports.DynamoDAOFactory = DynamoDAOFactory;
