import { LoginRequest, UserAuthResponse } from "tweeter-shared";
import { AuthenticationService } from "../../model/service/AuthenticationService";
import { DAOFactory } from "../../factory/DAOFactory";
import { DynamoDAOFactory } from "../../factory/DynamoDAOFactory";

// Initialize concrete DAOs once per cold start via the abstract factory.
if (!DAOFactory.instance) {
  DAOFactory.init(new DynamoDAOFactory());
}

export const handler = async (
  request: LoginRequest
): Promise<UserAuthResponse> => {
  const authenticationService = new AuthenticationService();

  if (!request.alias || request.alias.trim() === "") {
    throw new Error("bad-request: Alias cannot be empty");
  }

  if (!request.password || request.password.trim() === "") {
    throw new Error("bad-request: Password cannot be empty");
  }

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
