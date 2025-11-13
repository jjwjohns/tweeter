"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const handler = async (event) => {
    return {
        success: true,
        message: "Handler reached: unfollowFunction",
        inputEvent: event,
    };
};
exports.handler = handler;
