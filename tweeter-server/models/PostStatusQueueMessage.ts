export type PostStatusQueueMessage = {
  authorAlias: string;
  timestamp: number;
  post: string;
  urls: string[];
  mentions: string[];
};
