import {
  AuthToken,
  PagedUserItemRequest,
  TokenUserRequest,
  TokenUserSelectedUserRequest,
  User,
} from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../../network/ServerFacade";

export class FollowService implements Service {
  private server = new ServerFacade();

  async loadMoreFollowees(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastUser: User | null
  ): Promise<[User[], boolean]> {
    const request: PagedUserItemRequest = {
      token: authToken ? authToken.token : "",
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastUser ? lastUser.dto : null,
    };

    const [items, hasMore] = await this.server.getMoreFollowees(request);
    return [items, hasMore];
  }

  public async loadMoreFollowers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastUser: User | null
  ): Promise<[User[], boolean]> {
    const request: PagedUserItemRequest = {
      token: authToken ? authToken.token : "",
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastUser ? lastUser.dto : null,
    };

    const [items, hasMore] = await this.server.getMoreFollowers(request);
    return [items, hasMore];
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    const request: TokenUserSelectedUserRequest = {
      token: authToken ? authToken.token : "",
      user: user.dto,
      selectedUser: selectedUser.dto,
    };

    const response = await this.server.getIsFollowerStatus(request);

    return response.isFollower;
  }

  public async getFolloweeCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    const request: TokenUserRequest = {
      token: authToken ? authToken.token : "",
      selectedUser: user.dto,
    };

    const response = await this.server.getFolloweeCount(request);

    return response.number;
  }

  public async getFollowerCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    const request: TokenUserRequest = {
      token: authToken ? authToken.token : "",
      selectedUser: user.dto,
    };

    const response = await this.server.getFollowerCount(request);

    return response.number;
  }

  public async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    const request: TokenUserRequest = {
      token: authToken ? authToken.token : "",
      selectedUser: userToFollow.dto,
    };

    const response = await this.server.follow(request);

    return [response.followerCount, response.followeeCount];
  }

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    const request: TokenUserRequest = {
      token: authToken ? authToken.token : "",
      selectedUser: userToUnfollow.dto,
    };

    const response = await this.server.unfollow(request);

    return [response.followerCount, response.followeeCount];
  }
}
