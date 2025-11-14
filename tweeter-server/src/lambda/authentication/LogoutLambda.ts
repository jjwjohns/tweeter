import { AuthenticationService } from "../../model/service/AuthenticationService";
import { TokenRequest, TweeterResponse } from "tweeter-shared";

export const handler = async (
  request: TokenRequest
): Promise<TweeterResponse> => {
  const authenticationService = new AuthenticationService();

  await authenticationService.logout(request.token);

  return {
    success: true,
    message: "Logout successful",
  };
};
