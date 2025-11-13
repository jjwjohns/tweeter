import { TokenUserRequest, NumberResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (
  request: TokenUserRequest
): Promise<NumberResponse> => {
  const followService = new FollowService();

  const count = await followService.getFollowerCount(
    request.token,
    request.selectedUser
  );

  return {
    success: true,
    message: null,
    number: count,
  };
};
