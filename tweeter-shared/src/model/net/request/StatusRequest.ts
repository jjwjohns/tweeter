import { StatusDto } from "../../dto/StatusDto";
import { TweeterRequest } from "./TweeterRequest";

export interface StatusRequest extends TweeterRequest {
  status: StatusDto;
}
