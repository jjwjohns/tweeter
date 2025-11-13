import { AuthenticationService } from "../model/service/AuthenticationService";
import { AuthToken } from "tweeter-shared";
import { MessageView, Presenter, View } from "./Presenter";

export interface AppNavbarView extends MessageView {
  clearUserInfo: () => void;
  navigate: (path: string) => void;
}

export class AppNavbarPresenter extends Presenter<AppNavbarView> {
  private _service: AuthenticationService;

  public constructor(view: AppNavbarView) {
    super(view);
    this._service = new AuthenticationService();
  }

  public get service() {
    return this._service;
  }

  public async logOut(authToken: AuthToken) {
    const loggingOutToastId = this.view.displayInfoMessage("Logging Out...", 0);

    await this.doFailureRecordingOperation(async () => {
      await this.service.logout(authToken!);
      this.view.deleteMessage(loggingOutToastId);
      this.view.clearUserInfo();
      this.view.navigate("/login");
    }, "log out user");
  }
}
