import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { MessageView, Presenter, View } from "./Presenter";

export interface UserInfoView extends MessageView {
  setIsFollower: (isFollower: boolean) => void;
  setFolloweeCount: (count: number) => void;
  setFollowerCount: (count: number) => void;
  setIsLoading: (isLoading: boolean) => void;
  navigateToUser: (alias: string) => void;
  getCurrentUser: () => User | null;
  getDisplayedUser: () => User | null;
  setDisplayedUser: (user: User) => void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private service: FollowService;

  public constructor(view: UserInfoView) {
    super(view);
    this.service = new FollowService();
  }

  public async initialize(authToken: AuthToken): Promise<void> {
    const currentUser = this.view.getCurrentUser();
    const displayedUser = this.view.getDisplayedUser();

    if (!currentUser || !displayedUser) return;

    await this.setIsFollowerStatus(authToken, currentUser, displayedUser);
    await this.setNumbFollowees(authToken, displayedUser);
    await this.setNumbFollowers(authToken, displayedUser);
  }

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    await this.doFailureRecordingOperation(async () => {
      if (currentUser.equals(displayedUser)) {
        this.view.setIsFollower(false);
      } else {
        const isFollower = await this.service.getIsFollowerStatus(
          authToken,
          currentUser,
          displayedUser
        );
        this.view.setIsFollower(isFollower);
      }
    }, "determine follower status");
  }

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    await this.doFailureRecordingOperation(async () => {
      const count = await this.service.getFolloweeCount(
        authToken,
        displayedUser
      );
      this.view.setFolloweeCount(count);
    }, "get followee count");
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    await this.doFailureRecordingOperation(async () => {
      const count = await this.service.getFollowerCount(
        authToken,
        displayedUser
      );
      this.view.setFollowerCount(count);
    }, "get follower count");
  }

  public async followUser(authToken: AuthToken): Promise<void> {
    await this.followUnfollowOperation(
      authToken,
      async () => {
        const displayedUser = this.view.getDisplayedUser();
        if (!displayedUser) throw new Error("No displayed user");

        return this.service.follow(authToken, displayedUser);
      },
      "Following user",
      true
    );
  }

  public async unfollowUser(authToken: AuthToken): Promise<void> {
    await this.followUnfollowOperation(
      authToken,
      async () => {
        const displayedUser = this.view.getDisplayedUser();
        if (!displayedUser) throw new Error("No displayed user");

        return this.service.unfollow(authToken, displayedUser);
      },
      "Unfollowing user",
      false
    );
  }

  private async followUnfollowOperation(
    authToken: AuthToken,
    operation: () => Promise<[number, number]>,
    operationName: string,
    following: boolean
  ): Promise<void> {
    const displayedUser = this.view.getDisplayedUser();
    if (!displayedUser) return;

    let toastId = "";

    await this.doFailureRecordingOperation(
      async () => {
        this.view.setIsLoading(true);
        toastId = this.view.displayInfoMessage(
          `${operationName} ${displayedUser.name}...`,
          0
        );

        const [followerCount, followeeCount] = await operation();
        this.view.setIsFollower(following);
        this.view.setFollowerCount(followerCount);
        this.view.setFolloweeCount(followeeCount);
      },
      operationName,
      () => {
        this.view.deleteMessage(toastId);
        this.view.setIsLoading(false);
      }
    );
  }

  public switchToLoggedInUser(): void {
    const currentUser = this.view.getCurrentUser();
    if (!currentUser) return;
    this.view.setDisplayedUser(currentUser);
    this.view.navigateToUser(currentUser.alias);
  }
}
