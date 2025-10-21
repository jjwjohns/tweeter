import { AuthenticationService } from "../model.service/AuthenticationService";
import { AuthToken } from "tweeter-shared";
import { MessageView, Presenter, View } from "./Presenter";

export interface LogoutView extends MessageView {
  clearUserInfo: () => void;
  navigate: (path: string) => void;
}
  
export class LogoutPresenter extends Presenter<LogoutView> {
    private service: AuthenticationService

    public constructor(view: LogoutView) {
        super(view);
        this.service = new AuthenticationService();
    }
  
  public async logOut (authToken: AuthToken) {
    const loggingOutToastId = this.view.displayInfoMessage("Logging Out...", 0);

    await this.doFailureRecordingOperation(async () => {
      await this.service.logout(authToken!);
      this.view.deleteMessage(loggingOutToastId);
      this.view.clearUserInfo();
      this.view.navigate("/login");
    },
    "log out user");
  };
}