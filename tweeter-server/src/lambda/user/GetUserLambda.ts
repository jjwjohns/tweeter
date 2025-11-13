import { TokenAliasRequest } from "tweeter-shared";
import { UserResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: TokenAliasRequest
): Promise<UserResponse> => {
  const userService = new UserService();

  const user = await userService.getUser(request.token, request.userAlias);

  if (!user) {
    return {
      success: false,
      message: "User not found",
      user: null,
    };
  }

  return {
    success: true,
    message: "Success",
    user: user,
  };
};
