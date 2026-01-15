import { PostStatusQueueMessage } from "./PostStatusQueueMessage";

export type FeedWriteQueueMessage = {
  status: PostStatusQueueMessage;
  followerAliases: string[];
};
