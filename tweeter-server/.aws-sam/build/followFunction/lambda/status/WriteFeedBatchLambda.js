"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const StatusService_1 = require("../../model/service/StatusService");
const DAOFactory_1 = require("../../factory/DAOFactory");
const DynamoDAOFactory_1 = require("../../factory/DynamoDAOFactory");
if (!DAOFactory_1.DAOFactory.instance) {
    DAOFactory_1.DAOFactory.init(new DynamoDAOFactory_1.DynamoDAOFactory());
}
const handler = async (event) => {
    const statusService = new StatusService_1.StatusService();
    for (const record of event.Records) {
        const msg = JSON.parse(record.body);
        await statusService.writeFeedBatch(msg);
    }
};
exports.handler = handler;
