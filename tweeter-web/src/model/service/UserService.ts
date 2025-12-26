import { AuthToken, User, TokenAliasRequest } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../../network/ServerFacade";

export class UserService implements Service {
  private server = new ServerFacade();

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    const request: TokenAliasRequest = {
      token: authToken ? authToken.token : "",
      userAlias: alias,
    };

    const response = await this.server.getUser(request);

    return response;
  }
}
