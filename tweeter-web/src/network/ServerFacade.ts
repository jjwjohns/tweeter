import {
  FollowerFolloweeCountResponse,
  NumberResponse,
  PagedUserItemRequest,
  PagedUserItemResponse,
  TokenUserRequest,
  TokenUserSelectedUserRequest,
  IsFollowerResponse,
  User,
  UserDto,
  TokenAliasRequest,
  UserResponse,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL =
    "https://geptcahkg1.execute-api.us-east-1.amazonaws.com/prod";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  // Follow-related methods
  public async getMoreFollowees(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/getfollowees");

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto) => User.getUserFromDto(dto) as User)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No followees found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async getMoreFollowers(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/getfollowers");

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto) => User.getUserFromDto(dto) as User)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No followers found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async follow(
    request: TokenUserRequest
  ): Promise<FollowerFolloweeCountResponse> {
    const response = await this.clientCommunicator.doPost<
      TokenUserRequest,
      FollowerFolloweeCountResponse
    >(request, "/follow");

    if (response.success) {
      return response;
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async unfollow(
    request: TokenUserRequest
  ): Promise<FollowerFolloweeCountResponse> {
    const response = await this.clientCommunicator.doPost<
      TokenUserRequest,
      FollowerFolloweeCountResponse
    >(request, "/unfollow");

    if (response.success) {
      return response;
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async getFollowerCount(
    request: TokenUserRequest
  ): Promise<NumberResponse> {
    const response = await this.clientCommunicator.doPost<
      TokenUserRequest,
      NumberResponse
    >(request, "/getfollowerscount");

    if (response.success) {
      return response;
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async getFolloweeCount(
    request: TokenUserRequest
  ): Promise<NumberResponse> {
    const response = await this.clientCommunicator.doPost<
      TokenUserRequest,
      NumberResponse
    >(request, "/getfolloweecount");

    if (response.success) {
      return response;
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async getIsFollowerStatus(
    request: TokenUserSelectedUserRequest
  ): Promise<IsFollowerResponse> {
    const response = await this.clientCommunicator.doPost<
      TokenUserSelectedUserRequest,
      IsFollowerResponse
    >(request, "/getisfollowerstatus");

    if (response.success) {
      return response;
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  // User-related methods
  public async getUser(request: TokenAliasRequest): Promise<User | null> {
    const response = await this.clientCommunicator.doPost<
      TokenAliasRequest,
      UserResponse
    >(request, "/getuser");

    if (response.success) {
      return User.getUserFromDto(response.user!);
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }
}
