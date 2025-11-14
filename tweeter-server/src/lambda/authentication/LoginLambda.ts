import { LoginRequest, UserAuthResponse } from "tweeter-shared";
import { AuthenticationService } from "../../model/service/AuthenticationService";

export const handler = async (
  request: LoginRequest
): Promise<UserAuthResponse> => {
  const authenticationService = new AuthenticationService();

  const [userDto, token] = await authenticationService.login(
    request.alias,
    request.password
  );

  return {
    success: true,
    message: "Login successful",
    user: userDto,
    token: token.token,
  };
};
