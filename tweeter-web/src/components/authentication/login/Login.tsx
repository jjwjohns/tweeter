import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import { AuthToken, User } from "tweeter-shared";
import AuthenticationFields from "../AuthenticationFields";
import { useMessageActions } from "../../toaster/MessageHooks";
import { useUserInfoActions } from "../../userInfo/UserInfoHooks";
import { LoginPresenter, LoginView } from "../../../presenter/LoginPresenter";

interface Props {
  originalUrl?: string;
  presenter?: LoginPresenter;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfoActions();
  const { displayErrorMessage } = useMessageActions();

  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };

  const view: LoginView = {
    setIsLoading: setIsLoading,
    displayErrorMessage: displayErrorMessage,
    updateUserInfo: (loggedInUser: User, displayedUser: User, authToken: AuthToken, rememberMe: boolean) => {
      updateUserInfo(loggedInUser, displayedUser, authToken, rememberMe);
    },
    navigate: (path: string) => {
      navigate(path);
    }
  };

  const presenterRef = useRef<LoginPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = props.presenter ?? new LoginPresenter(view);
  }

  const loginOnEnter = async (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !checkSubmitButtonStatus()) {
      await presenterRef.current?.doLogin(alias, password, rememberMe, props.originalUrl);
    }
  };

  const handleSubmit = useCallback(
    async () => await presenterRef.current?.doLogin(alias, password, rememberMe, props.originalUrl),
    [alias, password, rememberMe, props.originalUrl]
  );

  const inputFieldFactory = () => {
    return (
      <AuthenticationFields function_auth={loginOnEnter} setAlias={setAlias} setPassword={setPassword} />
    );
  };

  const switchAuthenticationMethodFactory = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  useEffect(() => {
    presenterRef.current = props.presenter ?? new LoginPresenter(view);
  }, [rememberMe]);

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldFactory={inputFieldFactory}
      switchAuthenticationMethodFactory={switchAuthenticationMethodFactory}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={handleSubmit}
    />
  );
};

export default Login;
