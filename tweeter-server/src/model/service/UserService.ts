import { FakeData, UserDto } from "tweeter-shared";
import { Service } from "./Service";
import { AuthorizationService } from "./AuthorizationService";

export class UserService extends Service {
  public async getUser(token: string, alias: string): Promise<UserDto | null> {
    await new AuthorizationService().authorize(token);
    const dbUser = await this.users.getUser(alias);

    const user = FakeData.instance.findUserByAlias(alias);
    return user ? user.dto : null;
  }
}
