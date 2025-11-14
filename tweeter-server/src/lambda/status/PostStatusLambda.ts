import { StatusService } from "../../model/service/StatusService";
import { StatusRequest, TweeterResponse } from "tweeter-shared";

export const handler = async (
  request: StatusRequest
): Promise<TweeterResponse> => {
  const statusService = new StatusService();
  return statusService.postStatus(request.token, request.status);
};
