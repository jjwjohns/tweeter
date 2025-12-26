import { UserDto } from "tweeter-shared";
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

    const { aliases, hasMore } = await this.follows.getFollowees(
      userAlias,
      pageSize,
      lastItem
        ? {
            followerAlias: userAlias,
            followeeAlias: lastItem.alias,
          }
        : undefined
    );

    const dtos = await this.mapAliasesToUserDtos(aliases);

    return [dtos, hasMore];
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    await this.authorizationService.authorize(token);

    const { aliases, hasMore } = await this.follows.getFollowers(
      userAlias,
      pageSize,
      lastItem
        ? {
            followeeAlias: userAlias,
            followerAlias: lastItem.alias,
          }
        : undefined
    );

    const dtos = await this.mapAliasesToUserDtos(aliases);

    return [dtos, hasMore];
  }

  public async getIsFollowerStatus(
    token: string,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    await this.authorizationService.authorize(token);

    const following = await this.follows.isFollowing(
      user.alias,
      selectedUser.alias
    );

    return following;
  }

  public async getFolloweeCount(token: string, user: UserDto): Promise<number> {
    await this.authorizationService.authorize(token);

    const followeeCount = await this.follows.getFolloweeCount(user.alias);

    return followeeCount;
  }

  public async getFollowerCount(token: string, user: UserDto): Promise<number> {
    await this.authorizationService.authorize(token);

    const followerCount = await this.follows.getFollowerCount(user.alias);

    return followerCount;
  }

  public async follow(
    token: string,
    userToFollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    await this.authorizationService.authorize(token);

    await this.follows.follow(
      (await this.authTokens.getAliasForToken(token))!,
      userToFollow.alias
    );

    const followerCount = await this.getFollowerCount(token, userToFollow);
    const followeeCount = await this.getFolloweeCount(token, userToFollow);

    return [followerCount, followeeCount];
  }

  public async unfollow(
    token: string,
    userToUnfollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    await this.authorizationService.authorize(token);

    await this.follows.unfollow(
      (await this.authTokens.getAliasForToken(token))!,
      userToUnfollow.alias
    );

    const followerCount = await this.getFollowerCount(token, userToUnfollow);
    const followeeCount = await this.getFolloweeCount(token, userToUnfollow);
    return [followerCount, followeeCount];
  }

  private async mapAliasesToUserDtos(aliases: string[]): Promise<UserDto[]> {
    const dtos: UserDto[] = [];
    for (const alias of aliases) {
      const user = await this.users.getUser(alias);
      if (user) {
        dtos.push({
          firstName: user.firstName,
          lastName: user.lastName,
          alias: user.alias,
          imageUrl: user.imageUrl,
        });
      }
    }

    return dtos;
  }
}
