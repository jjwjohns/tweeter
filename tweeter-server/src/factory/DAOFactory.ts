import { UserDAO } from "../dao/UserDAO";
import { AuthTokenDAO } from "../dao/AuthTokenDAO";
import { FollowDAO } from "../dao/FollowDAO";
import { StoryDAO } from "../dao/StoryDAO";
import { FeedDAO } from "../dao/FeedDAO";
import { ImageDAO } from "../dao/ImageDAO";

export abstract class DAOFactory {
  static instance: DAOFactory;

  // One-time initializer to avoid accidental reconfiguration at runtime
  static init(instance: DAOFactory): void {
    if (DAOFactory.instance) {
      throw new Error("DAOFactory already initialized");
    }
    DAOFactory.instance = instance;
  }

  abstract getUserDAO(): UserDAO;
  abstract getAuthTokenDAO(): AuthTokenDAO;
  abstract getFollowDAO(): FollowDAO;
  abstract getStoryDAO(): StoryDAO;
  abstract getFeedDAO(): FeedDAO;
  abstract getImageDAO(): ImageDAO;
}
