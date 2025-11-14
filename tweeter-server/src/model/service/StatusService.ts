import { Status, StatusDto, TweeterResponse } from "tweeter-shared";
import { FakeData } from "tweeter-shared/dist/util/FakeData";
import { Service } from "./Service";

export class StatusService implements Service {
  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    return this.getFakeData(lastItem, pageSize);
  }

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    return this.getFakeData(lastItem, pageSize);
  }

  public async postStatus(
    token: string,
    newStatus: StatusDto
  ): Promise<TweeterResponse> {
    await new Promise((f) => setTimeout(f, 2000));
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
