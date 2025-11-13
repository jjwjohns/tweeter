import { StatusDto } from "../../dto/StatusDto";
import { TweeterResponse } from "./TweeterResponse";

export interface StatusResponse extends TweeterResponse {
  readonly statusDto: StatusDto | null;
}
