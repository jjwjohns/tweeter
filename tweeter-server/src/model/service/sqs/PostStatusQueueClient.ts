import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { PostStatusQueueMessage } from "../../../models/PostStatusQueueMessage";

export class PostStatusQueueClient {
  private sqs: SQSClient;
  private queueUrl: string;

  constructor(queueUrl?: string) {
    const resolvedUrl = queueUrl ?? process.env.POST_STATUS_QUEUE_URL;

    if (!resolvedUrl) {
      throw new Error("internal-server-error: Missing POST_STATUS_QUEUE_URL");
    }

    this.queueUrl = resolvedUrl;
    this.sqs = new SQSClient({});
  }

  public async sendPostStatusMessage(
    message: PostStatusQueueMessage
  ): Promise<void> {
    await this.sqs.send(
      new SendMessageCommand({
        QueueUrl: this.queueUrl,
        MessageBody: JSON.stringify(message),
      })
    );
  }
}
