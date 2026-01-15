import { PostStatusQueueMessage } from "./PostStatusQueueMessage";

export type FeedWriteQueueMessage = PostStatusQueueMessage & {
  followerAliases: string[];
};
