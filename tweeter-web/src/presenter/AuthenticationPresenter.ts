import { Presenter, View } from "./Presenter";
import { AuthenticationService } from "../model/service/AuthenticationService";
import { User, AuthToken } from "tweeter-shared";

export interface AuthenticationView extends View {
  setIsLoading: (isLoading: boolean) => void;
  updateUserInfo: (
    loggedInUser: User,
    displayedUser: User,
    authToken: AuthToken,
    rememberMe: boolean
  ) => void;
  navigate: (path: string) => void;
}

export class AuthenticationPresenter<
  V extends AuthenticationView
> extends Presenter<V> {
  protected service = new AuthenticationService();

  public constructor(view: V) {
    super(view);
  }

  protected async performAuthOperation(
    operation: () => Promise<[User, AuthToken]>,
    rememberMe: boolean,
    redirectPathBuilder: (user: User) => string,
    description: string
  ) {
    await this.doFailureRecordingOperation(
      async () => {
        this.view.setIsLoading(true);

        const [user, authToken] = await operation();
        this.view.updateUserInfo(user, user, authToken, rememberMe);

        const path = redirectPathBuilder(user);
        this.view.navigate(path);
      },
      description,
      () => this.view.setIsLoading(false)
    );
  }
}
