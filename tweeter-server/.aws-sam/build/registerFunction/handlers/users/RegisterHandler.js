"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerHandler = void 0;
// Simple register handler that returns dummy success and an authToken
const registerHandler = async (event, context) => {
    console.log("registerHandler invoked");
    try {
        const body = event.body ? JSON.parse(event.body) : {};
        console.log("request body:", body);
        // In M3 it's acceptable to return a hard-coded token; later milestones will implement real auth.
        const dummyAuthToken = {
            token: "M3-DUMMY-TOKEN",
            expiration: Date.now() + 1000 * 60 * 60,
        };
        const responseBody = {
            success: true,
            message: "User registered (dummy response)",
            authToken: dummyAuthToken,
        };
        // For non-proxy Lambda integration the template expects the lambda to return an object
        // (SAM/api-gateway mapping translates fields). Return object directly.
        return responseBody;
    }
    catch (err) {
        console.error("registerHandler error", err);
        return { errorMessage: err.message ?? "Internal error" };
    }
};
exports.registerHandler = registerHandler;
