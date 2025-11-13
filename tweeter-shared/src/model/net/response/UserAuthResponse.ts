import { AuthToken } from "../../domain/AuthToken";
import { UserResponse } from "./UserResponse";

export interface UserAuthResponse extends UserResponse {
  readonly authToken: AuthToken | null;
}
