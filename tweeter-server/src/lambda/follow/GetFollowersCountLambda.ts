import { TokenUserRequest, NumberResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { DAOFactory } from "../../factory/DAOFactory";
import { DynamoDAOFactory } from "../../factory/DynamoDAOFactory";

if (!DAOFactory.instance) {
  DAOFactory.init(new DynamoDAOFactory());
}

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
