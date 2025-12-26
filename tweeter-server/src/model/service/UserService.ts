import { User, UserDto } from "tweeter-shared";
import { Service } from "./Service";
import { AuthorizationService } from "./AuthorizationService";

export class UserService extends Service {
  private authorizer = new AuthorizationService();
  public async getUser(token: string, alias: string): Promise<UserDto | null> {
    await this.authorizer.authorize(token);

    const dbUser = await this.users.getUser(alias);

    if (!dbUser) {
      return null;
    }

    const user = new User(
      dbUser.firstName,
      dbUser.lastName,
      dbUser.alias,
      dbUser.imageUrl
    );

    return user.dto;
  }
}
