import { UserDto } from "../../dto/UserDto";
import { TokenUserRequest } from "./TokenUserRequest";

export interface TokenUserSelectedUserRequest extends TokenUserRequest {
  user: UserDto;
}
