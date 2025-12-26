export interface FollowDAO {
  follow(follower: string, followee: string): Promise<void>;

  unfollow(follower: string, followee: string): Promise<void>;

  getFollowers(
    followee: string,
    limit: number,
    lastKey?: any
  ): Promise<{ aliases: string[]; lastKey?: any }>;

  getFollowees(
    follower: string,
    limit: number,
    lastKey?: any
  ): Promise<{ aliases: string[]; lastKey?: any }>;

  getAllFollowers(followee: string): Promise<string[]>;

  getFollowerCount(followee: string): Promise<number>;

  getFolloweeCount(follower: string): Promise<number>;

  isFollowing(follower: string, followee: string): Promise<boolean>;
}
