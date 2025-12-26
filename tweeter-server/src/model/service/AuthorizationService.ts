import { Service } from "./Service";

export class AuthorizationService extends Service {
  public async authorize(token: string): Promise<string> {
    if (!token) {
      throw new Error("unauthorized: no token provided");
    }

    const valid = await this.authTokens.validateToken(token);

    if (!valid) {
      throw new Error("unauthorized: token invalid or expired");
    }

    // Optionally return alias for convenience
    const alias = await this.authTokens.getAliasForToken(token);

    if (!alias) {
      throw new Error("unauthorized: token invalid");
    }

    return alias;
  }
}
