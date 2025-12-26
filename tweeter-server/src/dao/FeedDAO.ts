export interface FeedDAO {
  getFeedPage(
    alias: string,
    limit: number,
    lastKey?: any
  ): Promise<{
    statuses: Array<{
      post: string;
      userAlias: string;
      timestamp: number;
    }>;
    lastKey?: any;
  }>;

  addStatusToFeeds(
    status: { post: string; userAlias: string; timestamp: number },
    followerAliases: string[]
  ): Promise<void>;
}
