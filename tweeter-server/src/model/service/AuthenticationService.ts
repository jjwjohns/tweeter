import bcrypt from "bcryptjs";

import { AuthToken, FakeData, UserDto, User } from "tweeter-shared";
import { Service } from "./Service";

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
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[UserDto, AuthToken]> {
    const passwordHash = await bcrypt.hash(password, 10);

    const base64Image = Buffer.from(userImageBytes).toString("base64");

    const imageUrl = await this.images.uploadProfileImage(
      `${alias}-profile-image.${imageFileExtension}`,
      base64Image
    );

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
