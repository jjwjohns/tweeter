import { RegisterRequest, UserAuthResponse } from "tweeter-shared";
import { AuthenticationService } from "../../model/service/AuthenticationService";

export const handler = async (
  request: RegisterRequest
): Promise<UserAuthResponse> => {
  const authenticationService = new AuthenticationService();

  const [userDto, token] = await authenticationService.register(
    request.firstName,
    request.lastName,
    request.alias,
    request.password,
    request.userImageBytes,
    request.imageFileExtension
  );

  return {
    success: true,
    message: "Registration successful",
    user: userDto,
    token: token.token,
  };
};
