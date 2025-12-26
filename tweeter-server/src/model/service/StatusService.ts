import { Status, StatusDto, TweeterResponse, User } from "tweeter-shared";
import { Service } from "./Service";
import { AuthorizationService } from "./AuthorizationService";

export class StatusService extends Service {
  private authorizationService = new AuthorizationService();

  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    await this.authorizationService.authorize(token);

    const { statuses, lastKey, hasMore } = await this.feeds.getFeedPage(
      userAlias,
      pageSize,
      lastItem
        ? {
            userAlias,
            timestamp: lastItem.timestamp,
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
            alias: userAlias,
            timestamp: lastItem.timestamp,
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

    // Write to author's story
    await this.stories.addStatus(authorAlias, newStatus.post, timestamp);

    // Fan-out to followers' feeds
    const followerAliases = await this.follows.getAllFollowers(authorAlias);

    await this.feeds.addStatusToFeeds(
      {
        post: newStatus.post,
        userAlias: authorAlias,
        timestamp,
      },
      followerAliases
    );

    return { success: true, message: "Status posted successfully." };
  }

  private async mapStatusesToDtos(
    statuses: Array<{ post: string; userAlias: string; timestamp: number }>,
    context: "feed" | "story"
  ): Promise<StatusDto[]> {
    const dtos: StatusDto[] = [];

    for (const status of statuses) {
      const author = await this.users.getUser(status.userAlias);
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
