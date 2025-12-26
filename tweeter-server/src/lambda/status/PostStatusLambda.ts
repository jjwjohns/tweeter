import { StatusService } from "../../model/service/StatusService";
import { StatusRequest, TweeterResponse } from "tweeter-shared";
import { DAOFactory } from "../../factory/DAOFactory";
import { DynamoDAOFactory } from "../../factory/DynamoDAOFactory";

if (!DAOFactory.instance) {
  DAOFactory.init(new DynamoDAOFactory());
}

export const handler = async (
  request: StatusRequest
): Promise<TweeterResponse> => {
  const statusService = new StatusService();
  const response = await statusService.postStatus(
    request.token,
    request.status
  );
  return response;
};
