import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { FeedWriteQueueMessage } from "../../../models/FeedWriteQueueMessage";

export class FeedWriteQueueClient {
  private sqs: SQSClient;
  private queueUrl: string;

  constructor(queueUrl?: string) {
    const resolvedUrl = queueUrl ?? process.env.FEED_WRITE_QUEUE_URL;

    if (!resolvedUrl) {
      throw new Error("internal-server-error: Missing FEED_WRITE_QUEUE_URL");
    }

    this.queueUrl = resolvedUrl;
    this.sqs = new SQSClient({});
  }

  public async sendFeedWriteMessage(
    message: FeedWriteQueueMessage
  ): Promise<void> {
    await this.sqs.send(
      new SendMessageCommand({
        QueueUrl: this.queueUrl,
        MessageBody: JSON.stringify(message),
      })
    );
  }
}
