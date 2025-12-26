import { Status, StatusDto, TweeterResponse, FakeData } from "tweeter-shared";
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

    return this.getFakeData(lastItem, pageSize);
  }

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    await this.authorizationService.authorize(token);

    return this.getFakeData(lastItem, pageSize);
  }

  public async postStatus(
    token: string,
    newStatus: StatusDto
  ): Promise<TweeterResponse> {
    await this.authorizationService.authorize(token);

    await new Promise((f) => setTimeout(f, 500));
    return { success: true, message: "Status posted successfully." };
  }

  private async getFakeData(
    lastItem: StatusDto | null,
    pageSize: number
  ): Promise<[StatusDto[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfStatuses(
      Status.getStatusFromDto(lastItem),
      pageSize
    );
    const dtos = items.map((status) => status.dto);
    return [dtos, hasMore];
  }
}
