import { AuthToken, FakeData, UserDto } from "tweeter-shared";
import { Service } from "./Service";

export class AuthenticationService extends Service {
  public async logout(token: string): Promise<void> {
    await new Promise((res) => setTimeout(res, 1000));
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[UserDto, AuthToken]> {
    const user = FakeData.instance.firstUser; // TODO: replace with this.users.getUser(alias)

    if (user === null) {
      throw new Error("Invalid alias or password");
    }

    return [user.dto, FakeData.instance.authToken];
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[UserDto, AuthToken]> {
    const user = FakeData.instance.firstUser; // TODO: create via this.users.createUser(...)

    if (user === null) {
      throw new Error("Invalid registration");
    }

    return [user.dto, FakeData.instance.authToken];
  }
}
