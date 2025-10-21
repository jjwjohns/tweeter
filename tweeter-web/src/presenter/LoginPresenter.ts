import { User, AuthToken } from "tweeter-shared";
import { AuthenticationService } from "../model.service/AuthenticationService";
import { Presenter, View } from "./Presenter";
import { AuthenticationPresenter, AuthenticationView } from "./AuthenticationPresenter";


export interface LoginView extends AuthenticationView{
}

export class LoginPresenter extends AuthenticationPresenter<LoginView> {
  public async doLogin(
    alias: string,
    password: string,
    rememberMe: boolean,
    originalUrl?: string
  ) {
    await this.performAuthOperation(
      async () => await this.service.login(alias, password),
      rememberMe,
      (user) => originalUrl ?? `/feed/${user.alias}`,
      "log in user"
    );
  }
}