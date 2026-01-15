"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedWriteQueueClient = void 0;
const client_sqs_1 = require("@aws-sdk/client-sqs");
class FeedWriteQueueClient {
    sqs;
    queueUrl;
    constructor(queueUrl) {
        const resolvedUrl = queueUrl ?? process.env.FEED_WRITE_QUEUE_URL;
        if (!resolvedUrl) {
            throw new Error("internal-server-error: Missing FEED_WRITE_QUEUE_URL");
        }
        this.queueUrl = resolvedUrl;
        this.sqs = new client_sqs_1.SQSClient({});
    }
    async sendFeedWriteMessage(message) {
        await this.sqs.send(new client_sqs_1.SendMessageCommand({
            QueueUrl: this.queueUrl,
            MessageBody: JSON.stringify(message),
        }));
    }
}
exports.FeedWriteQueueClient = FeedWriteQueueClient;
