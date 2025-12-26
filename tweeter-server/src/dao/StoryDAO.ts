export interface StoryDAO {
  addStatus(
    authorAlias: string,
    post: string,
    timestamp: number
  ): Promise<void>;

  getStoryPage(
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
}
