import { TweeterResponse } from "./TweeterResponse";

export interface FollowerFolloweeCountResponse extends TweeterResponse {
  readonly followerCount: number;
  readonly followeeCount: number;
}
