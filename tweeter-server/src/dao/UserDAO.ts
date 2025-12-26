export interface UserDAO {
  createUser(
    alias: string,
    firstName: string,
    lastName: string,
    passwordHash: string,
    imageUrl: string
  ): Promise<void>;

  getUser(alias: string): Promise<{
    alias: string;
    firstName: string;
    lastName: string;
    imageUrl: string;
    passwordHash: string;
    followerCount: number;
    followeeCount: number;
  } | null>;

  updateFollowCounts(
    alias: string,
    followerDelta: number,
    followeeDelta: number
  ): Promise<void>;
}
