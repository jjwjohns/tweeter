import { AuthToken, Status } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../../network/ServerFacade";

export class StatusService implements Service {
  private server = new ServerFacade();

  public async loadMoreFeedItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const request = {
      token: authToken ? authToken.token : "",
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem ? lastItem.dto : null,
    };

    const [items, hasMore] = await this.server.getMoreFeedItems(request);
    return [items, hasMore];
  }

  public async loadMoreStoryItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const request = {
      token: authToken ? authToken.token : "",
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem ? lastItem.dto : null,
    };

    const [items, hasMore] = await this.server.getMoreStoryItems(request);
    return [items, hasMore];
  }

  public async postStatus(authToken: AuthToken, status: Status): Promise<void> {
    const request = {
      token: authToken ? authToken.token : "",
      status: status.dto,
    };

    await this.server.postStatus(request);
  }
}
