import { StatusDto } from "../../dto/StatusDto";
import { TweeterRequest } from "./TweeterRequest";

export interface StatusRequest extends TweeterRequest {
  token: string;
  status: StatusDto;
}
