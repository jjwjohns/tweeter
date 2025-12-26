import { RegisterRequest, UserAuthResponse } from "tweeter-shared";
import { AuthenticationService } from "../../model/service/AuthenticationService";
import { DAOFactory } from "../../factory/DAOFactory";
import { DynamoDAOFactory } from "../../factory/DynamoDAOFactory";

if (!DAOFactory.instance) {
  DAOFactory.init(new DynamoDAOFactory());
}

export const handler = async (
  request: RegisterRequest
): Promise<UserAuthResponse> => {
  const authenticationService = new AuthenticationService();

  if (!request.firstName || request.firstName.trim() === "") {
    throw new Error("bad-request: First name cannot be empty");
  }

  if (!request.lastName || request.lastName.trim() === "") {
    throw new Error("bad-request: Last name cannot be empty");
  }

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
