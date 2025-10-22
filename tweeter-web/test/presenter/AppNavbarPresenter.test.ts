import { AuthToken } from "tweeter-shared";
import { AppNavbarPresenter, AppNavbarView } from "../../src/presenter/AppNavbarPresenter";
import { anything, instance, mock, spy, verify, when } from "@typestrong/ts-mockito"
import { AuthenticationService as AuthService } from "../../src/model.service/AuthenticationService";

describe("AppNavbarPresenter", () => {
    let mockAppNavbarView: AppNavbarView;
    let appNavbarPresenter: AppNavbarPresenter;
    let mockAuthService: AuthService;

    const authToken = new AuthToken("test-token", Date.now());

    beforeEach(() => {
        mockAppNavbarView = mock<AppNavbarView>();
        const mockAppNavbarViewInstance = instance(mockAppNavbarView);
        when(mockAppNavbarView.displayInfoMessage(anything(), 0)).thenReturn("toast-id");

        const appNavbarPresenterSpy = spy(new AppNavbarPresenter(mockAppNavbarViewInstance));
        appNavbarPresenter = instance(appNavbarPresenterSpy);

        mockAuthService = mock<AuthService>();
        when(appNavbarPresenterSpy.service).thenReturn(instance(mockAuthService));
    });

    it("tells the view to display a logging out mesage", async () => {
        await appNavbarPresenter.logOut(authToken);
        verify(mockAppNavbarView.displayInfoMessage(anything(), 0)).once();
    });

    it("calls logout on the user service with the correct auth token", async () => {
        await appNavbarPresenter.logOut(authToken);
        verify(mockAuthService.logout(authToken)).once();
    });

    it("the presenter tells the view to clear the info message that was displayed previously, clear the user info, and navigate to the login page", async () => {
        await appNavbarPresenter.logOut(authToken);

        verify(mockAppNavbarView.deleteMessage("toast-id")).once();
        verify(mockAppNavbarView.clearUserInfo()).once();
        verify(mockAppNavbarView.navigate("/login")).once();
        verify(mockAppNavbarView.displayErrorMessage(anything())).never();
    });

    it("the presenter tells the view to display an error message and does not tell it to clear the info message, clear the user info or navigate to the login page when unsuccessful.", async () => {
        when(mockAuthService.logout(anything())).thenReject(new Error("Logout failed"));

        await appNavbarPresenter.logOut(authToken);

        verify(mockAppNavbarView.displayErrorMessage("Failed to log out user because of exception: Error: Logout failed")).once();
        verify(mockAppNavbarView.deleteMessage(anything())).never();
        verify(mockAppNavbarView.clearUserInfo()).never();
        verify(mockAppNavbarView.navigate("/login")).never();
    });
});
