import { FollowService } from "../../model/service/FollowService";
import {
  TokenUserRequest,
  FollowerFolloweeCountResponse,
} from "tweeter-shared";

export const handler = async (
  request: TokenUserRequest
): Promise<FollowerFolloweeCountResponse> => {
  const followService = new FollowService();

  const [followerCount, followeeCount] = await followService.unfollow(
    request.token,
    request.selectedUser
  );

  return {
    success: true,
    message: "Unfollow successful",
    followerCount,
    followeeCount,
  };
};
