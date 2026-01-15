"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DAOFactory = void 0;
class DAOFactory {
    static instance;
    // One-time initializer to avoid accidental reconfiguration at runtime
    static init(instance) {
        if (DAOFactory.instance) {
            throw new Error("DAOFactory already initialized");
        }
        DAOFactory.instance = instance;
    }
}
exports.DAOFactory = DAOFactory;
