"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostStatusQueueClient = void 0;
const client_sqs_1 = require("@aws-sdk/client-sqs");
class PostStatusQueueClient {
    sqs;
    queueUrl;
    constructor(queueUrl) {
        const resolvedUrl = queueUrl ?? process.env.POST_STATUS_QUEUE_URL;
        if (!resolvedUrl) {
            throw new Error("internal-server-error: Missing POST_STATUS_QUEUE_URL");
        }
        this.queueUrl = resolvedUrl;
        this.sqs = new client_sqs_1.SQSClient({});
    }
    async sendPostStatusMessage(message) {
        await this.sqs.send(new client_sqs_1.SendMessageCommand({
            QueueUrl: this.queueUrl,
            MessageBody: JSON.stringify(message),
        }));
    }
}
exports.PostStatusQueueClient = PostStatusQueueClient;
