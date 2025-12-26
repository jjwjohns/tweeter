import {
  TokenUserSelectedUserRequest,
  IsFollowerResponse,
} from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { DAOFactory } from "../../factory/DAOFactory";
import { DynamoDAOFactory } from "../../factory/DynamoDAOFactory";

if (!DAOFactory.instance) {
  DAOFactory.init(new DynamoDAOFactory());
}

export const handler = async (
  request: TokenUserSelectedUserRequest
): Promise<IsFollowerResponse> => {
  const followService = new FollowService();

  const isFollower = await followService.getIsFollowerStatus(
    request.token,
    request.user,
    request.selectedUser
  );

  return {
    success: true,
    message: null,
    isFollower: isFollower,
  };
};
