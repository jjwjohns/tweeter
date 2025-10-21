import { AuthToken } from "tweeter-shared";
import { AppNavbarPresenter, AppNavbarView } from "../../src/presenter/AppNavbarPresenter";
import { anything, instance, mock, verify } from "@typestrong/ts-mockito"

describe("AppNavbarPresenter", () => {
    let mockAppNavbarView: AppNavbarView;
    let appNavbarPresenter: AppNavbarPresenter;

    const authToken = new AuthToken("test-token", Date.now());

    beforeEach(() => {
        mockAppNavbarView = mock<AppNavbarView>();
        const mockAppNavbarViewInstance = instance(mockAppNavbarView);

        appNavbarPresenter = new AppNavbarPresenter(mockAppNavbarViewInstance);
    });

    it("tells the view to display a logging out mesage", () => {
        appNavbarPresenter.logOut(authToken);
        verify(mockAppNavbarView.displayInfoMessage(anything(), 0)).once();
    });

});
