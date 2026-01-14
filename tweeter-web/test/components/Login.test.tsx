// import { MemoryRouter } from "react-router-dom";
// import { render, screen } from "@testing-library/react";
// import { userEvent } from "@testing-library/user-event";
// import { library } from "@fortawesome/fontawesome-svg-core";
// import { fab } from "@fortawesome/free-brands-svg-icons";
// import "@testing-library/jest-dom";
// import Login from "../../src/components/authentication/login/Login";
// import { LoginPresenter } from "../../src/presenter/LoginPresenter";
// import { anything, instance, mock, verify } from "@typestrong/ts-mockito";

// library.add(fab);

// describe("Login Component", () => {
//     it("starts with signin button disabled", () => {
//         const { signInButton } = renderLoginAndGetElements("/");

//         expect(signInButton).toBeDisabled();
//     });

//     it("enables signin button if both alias and password have text", async () => {
//         const { user, signInButton, aliasField, passwordField } = renderLoginAndGetElements("/");

//         await fillFieldsAndCheckSigninIsEnabled(user, aliasField, passwordField, signInButton);
//     });

//     it("disables signin button if alias or password field is clear", async () => {
//         const { user, signInButton, aliasField, passwordField } = renderLoginAndGetElements("/");

//         await fillFieldsAndCheckSigninIsEnabled(user, aliasField, passwordField, signInButton);

//         await user.clear(aliasField);
//         expect(signInButton).toBeDisabled();

//         await user.type(aliasField, "a");
//         expect(signInButton).toBeEnabled();

//         await user.clear(passwordField);
//         expect(signInButton).toBeDisabled();
//     });

//     it("calls the presenter's login method with correct parameters when signin button is pressed", async () => {
//         const mockPresenter = mock<LoginPresenter>();
//         const mockPresenterInstance = instance(mockPresenter);

//         const originalUrl = "https://realurl.com"
//         const alias = "Batman"
//         const password = "supersecret"
//         const { user, signInButton, aliasField, passwordField } = renderLoginAndGetElements(originalUrl, mockPresenterInstance);

//         await user.type(aliasField, alias);
//         await user.type(passwordField, password)
//         await user.click(signInButton);

//         verify(mockPresenter.doLogin(alias, password, false, originalUrl)).once();
//     });
// });

// function renderLogin(originalUrl: string, presenter?: LoginPresenter) {
//     return render(
//         <MemoryRouter>
//             {!!presenter ? ((<Login originalUrl={originalUrl} presenter={presenter} />)) : (<Login originalUrl={originalUrl} />)}
//         </MemoryRouter>
//     );
// }

// function renderLoginAndGetElements(originalUrl: string, presenter?: LoginPresenter) {
//     const user = userEvent.setup();

//     renderLogin(originalUrl, presenter);

//     const signInButton = screen.getByRole("button", { name: /Sign in/i});
//     const aliasField = screen.getByLabelText("alias");
//     const passwordField = screen.getByLabelText("password");

//     return { user, signInButton, aliasField, passwordField };
// }

// async function fillFieldsAndCheckSigninIsEnabled(user: any, aliasField: HTMLElement, passwordField: HTMLElement, signInButton: HTMLElement) {
//     await user.type(aliasField, "a");
//     await user.type(passwordField, "pass");

//     expect(signInButton).toBeEnabled();
// }
