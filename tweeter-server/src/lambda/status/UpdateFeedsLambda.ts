import { SQSEvent } from "aws-lambda";
import { PostStatusQueueMessage } from "../../models/PostStatusQueueMessage";
import { StatusService } from "../../model/service/StatusService";
import { DAOFactory } from "../../factory/DAOFactory";
import { DynamoDAOFactory } from "../../factory/DynamoDAOFactory";

if (!DAOFactory.instance) {
  DAOFactory.init(new DynamoDAOFactory());
}

export const handler = async (event: SQSEvent): Promise<void> => {
  const statusService = new StatusService();

  for (const record of event.Records) {
    const msg = JSON.parse(record.body) as PostStatusQueueMessage;
    await statusService.updateFeeds(msg);
  }
};
