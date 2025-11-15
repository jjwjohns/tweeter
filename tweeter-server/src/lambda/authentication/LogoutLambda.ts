import { AuthenticationService } from "../../model/service/AuthenticationService";
import { TokenRequest, TweeterResponse } from "tweeter-shared";

export const handler = async (
  request: TokenRequest
): Promise<TweeterResponse> => {
  const authenticationService = new AuthenticationService();

  if (!request.token || request.token.trim() === "") {
    throw new Error("bad-request: Token cannot be empty");
  }

  await authenticationService.logout(request.token);

  return {
    success: true,
    message: "Logout successful",
  };
};
