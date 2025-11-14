import { TweeterRequest } from "./TweeterRequest";

export interface TokenRequest extends TweeterRequest {
  token: string;
}
