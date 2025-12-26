export interface StoryDAO {
  addStatus(
    authorAlias: string,
    post: string,
    timestamp: number
  ): Promise<void>;

  getStoryPage(
    authorAlias: string,
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
}
