import { AuthToken, FakeData, UserDto, User } from "tweeter-shared";
import { Service } from "./Service";

const bcrypt = require("bcryptjs");
export class AuthenticationService extends Service {
  public async logout(token: string): Promise<void> {
    await this.authTokens.deleteToken(token);
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[UserDto, AuthToken]> {
    const dbUser = await this.users.getUser(alias);

    if (!dbUser) {
      throw new Error("Invalid alias or password");
    }

    const valid = await bcrypt.compare(password, dbUser.passwordHash);

    if (!valid) {
      throw new Error("Invalid alias or password");
    }

    const user = new User(
      dbUser.firstName,
      dbUser.lastName,
      dbUser.alias,
      dbUser.imageUrl
    );

    const expiration = Date.now() + 1000 * 60 * 60;
    const issuedAt = Date.now();
    const token = await this.authTokens.createToken(user.alias, expiration);
    const authToken = new AuthToken(token, issuedAt);

    return [user.dto, authToken];
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBase64: string,
    imageFileExtension: string
  ): Promise<[UserDto, AuthToken]> {
    console.log(
      "[AuthService Server] Received base64 length:",
      userImageBase64?.length || 0
    );
    const passwordHash = await bcrypt.hash(password, 10);

    const imageUrl = await this.images.uploadProfileImage(
      `${alias}-profile-image.${imageFileExtension}`,
      userImageBase64
    );
    console.log("[AuthService Server] Image uploaded to:", imageUrl);

    await this.users.createUser(
      alias,
      firstName,
      lastName,
      passwordHash,
      imageUrl
    );

    const user = new User(firstName, lastName, alias, imageUrl);

    const expiration = Date.now() + 1000 * 60 * 60; // 1 hour
    const issuedAt = Date.now();
    const token = await this.authTokens.createToken(user.alias, expiration);
    const authToken = new AuthToken(token, issuedAt);

    return [user.dto, authToken];
  }
}
