import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import "@testing-library/jest-dom";
import PostStatus from "../../src/components/postStatus/PostStatus";
import { PostStatusPresenter } from "../../src/presenter/PostStatusPresenter";
import { anything, instance, mock, verify } from "@typestrong/ts-mockito";
import { useUserInfo } from "../../src/components/userInfo/UserInfoHooks";
import { User } from "tweeter-shared/dist/model/domain/User";
import { AuthToken } from "tweeter-shared";

library.add(fab);

jest.mock("../../src/components/userInfo/UserInfoHooks", () => ({
  ...jest.requireActual("../../src/components/userInfo/UserInfoHooks"),
  __esModule: true,
  useUserInfo: jest.fn(),
}));   

describe("PostStatus Component", () => {    
    const mockUserInstance = { alias: "@testuser", name: "Test User" } as User;
    const mockAuthTokenInstance = { token: "fake-token" } as AuthToken;
    beforeAll(() => {
        (useUserInfo as jest.Mock).mockReturnValue({
        currentUser: mockUserInstance,
        authToken: mockAuthTokenInstance,
        });      
    })

    it("When first rendered the Post Status and Clear buttons are both disabled", () => {
        const {postButton, clearButton} = renderPostStatusAndGetElements();
        expect(postButton).toBeDisabled();
        expect(clearButton).toBeDisabled();
    });

    it("Both buttons are enabled when the text field has text", async () => {
        const { user, postButton, clearButton, postField } = renderPostStatusAndGetElements();

        await typeEntryCheckEnabled(user, postButton, clearButton, postField);
    })

    it("Both buttons are disabled when text field is cleared", async () => {
        const { user, postButton, clearButton, postField } = renderPostStatusAndGetElements();
        await typeEntryCheckEnabled(user, postButton, clearButton, postField);

        user.clear(postField);
        expect(postButton).toBeDisabled();
        expect(clearButton).toBeDisabled();
    });

    it("The presenter's postStatus method is called with correct parameters when the Post Status button is pressed", async () => {
        const mockPresenter = mock<PostStatusPresenter>();
        const mockPresenterInstance = instance(mockPresenter);
        const entryText = "Hello World"

        const { user, postButton, postField } = renderPostStatusAndGetElements(mockPresenterInstance);

        await user.type(postField, entryText)
        await user.click(postButton)

        verify(mockPresenter.submitPost(entryText, mockUserInstance, mockAuthTokenInstance)).once();
    });
});


function renderPostStatus(presenter?: PostStatusPresenter) {
    return render(
        <MemoryRouter>
            {!!presenter ? ((<PostStatus presenter={presenter} />)) : (<PostStatus />)}
        </MemoryRouter>
    );
}

function renderPostStatusAndGetElements(presenter?: PostStatusPresenter) {
    const user = userEvent.setup();

    renderPostStatus(presenter);

    const postButton = screen.getByTestId("post-status-btn");
    const clearButton = screen.getByTestId("clear-status-btn");
    const postField = screen.getByLabelText("postField");

    return { user, postButton, clearButton, postField };
}

async function typeEntryCheckEnabled(user: any, postButton: HTMLElement, clearButton: HTMLElement, postField: HTMLElement) {
    await user.type(postField, "hello world");
    expect(postButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
}