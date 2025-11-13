import { UserDto } from "../../dto/UserDto";
import { TweeterRequest } from "./TweeterRequest";

export interface TokenAliasRequest extends TweeterRequest {
  userAlias: string;
}
