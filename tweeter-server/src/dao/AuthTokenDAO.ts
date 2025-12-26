export interface AuthTokenDAO {
  createToken(alias: string, expirationEpoch: number): Promise<string>;

  validateToken(token: string): Promise<boolean>;

  getAliasForToken(token: string): Promise<string | null>;

  deleteToken(token: string): Promise<void>;
}
