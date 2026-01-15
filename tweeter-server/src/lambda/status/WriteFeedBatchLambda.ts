import { SQSEvent } from "aws-lambda";
import { FeedWriteQueueMessage } from "../../models/FeedWriteQueueMessage";
import { StatusService } from "../../model/service/StatusService";
import { DAOFactory } from "../../factory/DAOFactory";
import { DynamoDAOFactory } from "../../factory/DynamoDAOFactory";

if (!DAOFactory.instance) {
  DAOFactory.init(new DynamoDAOFactory());
}

export const handler = async (event: SQSEvent): Promise<void> => {
  const statusService = new StatusService();

  for (const record of event.Records) {
    const msg = JSON.parse(record.body) as FeedWriteQueueMessage;
    await statusService.writeFeedBatch(msg);
  }
};
