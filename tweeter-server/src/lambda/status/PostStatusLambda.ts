import { StatusService } from "../../model/service/StatusService";
import { StatusRequest } from "tweeter-shared";

export const handler = async (request: StatusRequest): Promise<void> => {
  const statusService = new StatusService();
  return statusService.postStatus(request.token, request.status);
};
