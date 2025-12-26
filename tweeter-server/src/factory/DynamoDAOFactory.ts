import { DAOFactory } from "./DAOFactory";

import { UserDAO } from "../dao/UserDAO";
import { AuthTokenDAO } from "../dao/AuthTokenDAO";
import { FollowDAO } from "../dao/FollowDAO";
import { StoryDAO } from "../dao/StoryDAO";
import { FeedDAO } from "../dao/FeedDAO";
import { ImageDAO } from "../dao/ImageDAO";

import { DynamoUserDAO } from "../dao/dynamo/DynamoUserDAO";
import { DynamoAuthTokenDAO } from "../dao/dynamo/DynamoAuthTokenDAO";
import { DynamoFollowDAO } from "../dao/dynamo/DynamoFollowDAO";
import { DynamoStoryDAO } from "../dao/dynamo/DynamoStoryDAO";
import { DynamoFeedDAO } from "../dao/dynamo/DynamoFeedDAO";
import { S3ImageDAO } from "../dao/dynamo/S3ImageDAO";

export class DynamoDAOFactory extends DAOFactory {
  getUserDAO(): UserDAO {
    return new DynamoUserDAO();
  }

  getAuthTokenDAO(): AuthTokenDAO {
    return new DynamoAuthTokenDAO();
  }

  getFollowDAO(): FollowDAO {
    return new DynamoFollowDAO();
  }

  getStoryDAO(): StoryDAO {
    return new DynamoStoryDAO();
  }

  getFeedDAO(): FeedDAO {
    return new DynamoFeedDAO();
  }

  getImageDAO(): ImageDAO {
    return new S3ImageDAO();
  }
}
