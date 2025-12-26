export interface FeedDAO {
  getFeedPage(
    userAlias: string,
    limit: number,
    lastKey?: any
  ): Promise<{
    statuses: Array<{
      post: string;
      authorAlias: string;
      timestamp: number;
    }>;
    lastKey?: any;
    hasMore: boolean;
  }>;

  addStatusToFeeds(
    status: { post: string; authorAlias: string; timestamp: number },
    followerAliases: string[]
  ): Promise<void>;
}
