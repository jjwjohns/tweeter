import { Status, StatusDto, TweeterResponse, User } from "tweeter-shared";
import { Service } from "./Service";
import { AuthorizationService } from "./AuthorizationService";
import { PostStatusQueueClient } from "./sqs/PostStatusQueueClient";
import { FeedWriteQueueClient } from "./sqs/FeedWriteQueueClient";
import { FeedWriteQueueMessage } from "../../models/FeedWriteQueueMessage";
import { PostStatusQueueMessage } from "../../models/PostStatusQueueMessage";

export class StatusService extends Service {
  private authorizationService = new AuthorizationService();
  public async loadMoreFeedItems(
    token: string,
    authorAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    await this.authorizationService.authorize(token);

    const { statuses, lastKey, hasMore } = await this.feeds.getFeedPage(
      authorAlias,
      pageSize,
      lastItem
        ? {
            userAlias: authorAlias,
            timestamp: lastItem.timestamp.toString(),
          }
        : undefined
    );

    const dtos = await this.mapStatusesToDtos(statuses, "feed");

    return [dtos, hasMore];
  }

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    await this.authorizationService.authorize(token);

    const { statuses, hasMore } = await this.stories.getStoryPage(
      userAlias,
      pageSize,
      lastItem
        ? {
            authorAlias: userAlias,
            timestamp: lastItem.timestamp.toString(),
          }
        : undefined
    );

    const dtos = await this.mapStatusesToDtos(statuses, "story");

    return [dtos, hasMore];
  }

  public async postStatus(
    token: string,
    newStatus: StatusDto
  ): Promise<TweeterResponse> {
    await this.authorizationService.authorize(token);

    if (!newStatus?.user?.alias) {
      throw new Error("bad-request: missing author alias");
    }

    const authorAlias = newStatus.user.alias;
    const timestamp = newStatus.timestamp ?? Date.now();

    await this.stories.addStatus(authorAlias, newStatus.post, timestamp);

    const postStatusQueue = new PostStatusQueueClient();
    await postStatusQueue.sendPostStatusMessage({
      authorAlias,
      timestamp,
      post: newStatus.post,
    });

    return { success: true, message: "Status posted successfully." };

    // const followerAliases = await this.follows.getAllFollowers(authorAlias);

    // await this.feeds.addStatusToFeeds(
    //   {
    //     post: newStatus.post,
    //     authorAlias: authorAlias,
    //     timestamp,
    //   },
    //   followerAliases
    // );

    // return { success: true, message: "Status posted successfully." };
  }

  public async updateFeeds(message: PostStatusQueueMessage): Promise<void> {
    const feedWriteQueueUrl = process.env.FEED_WRITE_QUEUE_URL;
    if (!feedWriteQueueUrl) {
      throw new Error(
        "internal-server-error: Missing env var FEED_WRITE_QUEUE_URL"
      );
    }

    const { authorAlias, timestamp, post } = message;

    if (!authorAlias || !timestamp || !post) {
      throw new Error(
        "bad-request: updateFeeds message missing required fields"
      );
    }

    // 1) Page through all followers
    const followerAliases: string[] = [];
    let lastFollowerAlias: string | undefined = undefined;
    let hasMore = true;

    const pageSize = 1000; // follower page size (not 25)

    while (hasMore) {
      /**
       * You need a DAO method like:
       *   getFollowersPage(followeeAlias, limit, lastFollowerAlias?)
       *
       * It should return:
       *   { followerAliases: string[], hasMore: boolean }
       *
       * If your DAO returns follower objects instead, map them here.
       */
      const page = await this.follows.getFollowersPage(
        authorAlias,
        pageSize,
        lastFollowerAlias
      );

      // Example expected shape:
      // page = { followerAliases: string[], hasMore: boolean }

      followerAliases.push(...page.followerAliases);
      hasMore = page.hasMore;

      if (page.followerAliases.length > 0) {
        lastFollowerAlias =
          page.followerAliases[page.followerAliases.length - 1];
      } else {
        hasMore = false;
      }
    }

    // 2) Break followers into batches of 25
    const BATCH_SIZE = 25;
    const batches: string[][] = [];
    for (let i = 0; i < followerAliases.length; i += BATCH_SIZE) {
      batches.push(followerAliases.slice(i, i + BATCH_SIZE));
    }

    // 3) Send each batch to FeedWriteQueue
    const feedWriteQueue = new FeedWriteQueueClient();

    const sendPromises: Promise<void>[] = [];
    for (const batch of batches) {
      const msg: FeedWriteQueueMessage = {
        authorAlias,
        timestamp,
        post,
        followerAliases: batch,
      };

      sendPromises.push(feedWriteQueue.sendFeedWriteMessage(msg));
    }

    // Parallel sends is fine for ~400 messages (10k followers / 25)
    await Promise.all(sendPromises);
  }

  public async writeFeedBatch(message: FeedWriteQueueMessage): Promise<void> {
    const { authorAlias, timestamp, post, followerAliases } = message;

    if (!authorAlias || !timestamp || !post) {
      throw new Error(
        "bad-request: writeFeedBatch message missing status fields"
      );
    }

    if (!followerAliases || followerAliases.length === 0) {
      return; // nothing to write
    }

    // Safety: should always be <= 25
    if (followerAliases.length > 25) {
      throw new Error(
        "bad-request: writeFeedBatch received more than 25 followers"
      );
    }

    /**
     * Your feed DAO should ideally expose a method like:
     *    addFeedBatch(items: Array<{ userAlias, timestamp, authorAlias, post }>)
     * or something similar.
     *
     * Build whatever shape your feed table expects.
     */
    const feedItems = followerAliases.map((followerAlias) => ({
      userAlias: followerAlias, // partition key for feed table
      timestamp, // sort key
      authorAlias,
      post,
    }));

    await this.feeds.addFeedBatch(feedItems);
  }

  private async mapStatusesToDtos(
    statuses: Array<{ post: string; authorAlias: string; timestamp: number }>,
    context: "feed" | "story"
  ): Promise<StatusDto[]> {
    const dtos: StatusDto[] = [];

    for (const status of statuses) {
      const author = await this.users.getUser(status.authorAlias);
      if (!author) {
        throw new Error(
          `internal-server-error: author not found for ${context} item`
        );
      }

      const statusObj = new Status(
        status.post,
        new User(
          author.firstName,
          author.lastName,
          author.alias,
          author.imageUrl
        ),
        status.timestamp
      );

      dtos.push(statusObj.dto);
    }

    return dtos;
  }
}
