import { AuthToken } from "tweeter-shared/dist/model/domain/AuthToken";
import { User } from "tweeter-shared/dist/model/domain/User";
import { Service } from "./Service";
import { ServerFacade } from "../../network/ServerFacade";
import { Buffer } from "buffer";

export class AuthenticationService implements Service {
  private server = new ServerFacade();

  public async logout(authToken: AuthToken): Promise<void> {
    const request = {
      token: authToken ? authToken.token : "",
    };

    await this.server.logout(request);
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    const request = {
      alias: alias,
      password: password,
    };

    return this.server.login(request);
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    console.log(
      "[AuthService Client] Received image bytes length:",
      userImageBytes.length
    );
    const base64 = Buffer.from(userImageBytes).toString("base64");
    console.log("[AuthService Client] Base64 string length:", base64.length);

    const request = {
      firstName: firstName,
      lastName: lastName,
      alias: alias,
      password: password,
      userImageBase64: base64,
      imageFileExtension: imageFileExtension,
    };

    return this.server.register(request);
  }
}
