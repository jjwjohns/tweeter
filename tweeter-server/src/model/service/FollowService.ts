import { FakeData, User, UserDto } from "tweeter-shared";
import { Service } from "./Service";
import { AuthorizationService } from "./AuthorizationService";

export class FollowService extends Service {
  private authorizationService = new AuthorizationService();

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    await this.authorizationService.authorize(token);

    return this.getFakeData(lastItem, pageSize, userAlias);
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    await this.authorizationService.authorize(token);

    return this.getFakeData(lastItem, pageSize, userAlias);
  }

  public async getIsFollowerStatus(
    token: string,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    await this.authorizationService.authorize(token);

    return FakeData.instance.isFollower();
  }

  public async getFolloweeCount(token: string, user: UserDto): Promise<number> {
    await this.authorizationService.authorize(token);

    return FakeData.instance.getFolloweeCount(user.alias);
  }

  public async getFollowerCount(token: string, user: UserDto): Promise<number> {
    await this.authorizationService.authorize(token);

    return FakeData.instance.getFollowerCount(user.alias);
  }

  public async follow(
    token: string,
    userToFollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    await this.authorizationService.authorize(token);

    await new Promise((f) => setTimeout(f, 500));

    const followerCount = await this.getFollowerCount(token, userToFollow);
    const followeeCount = await this.getFolloweeCount(token, userToFollow);

    return [followerCount, followeeCount];
  }

  public async unfollow(
    token: string,
    userToUnfollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    await this.authorizationService.authorize(token);

    await new Promise((f) => setTimeout(f, 500));

    const followerCount = await this.getFollowerCount(token, userToUnfollow);
    const followeeCount = await this.getFolloweeCount(token, userToUnfollow);

    return [followerCount, followeeCount];
  }

  private async getFakeData(
    lastItem: UserDto | null,
    pageSize: number,
    userAlias: string
  ): Promise<[UserDto[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfUsers(
      User.getUserFromDto(lastItem),
      pageSize,
      userAlias
    );
    const dtos = items.map((user) => user.dto);
    return [dtos, hasMore];
  }
}
