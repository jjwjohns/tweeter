import { useContext } from "react";
import { User, AuthToken } from "tweeter-shared";
import { UserInfoActionsContext, UserInfoContext } from "./UserInfoContexts";

interface UserInfoActions {
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void,
  clearUserInfo: () => void,
  setDisplayedUser: (user: User) => void,
}

export const useUserInfoActions = (): UserInfoActions => {
  const {updateUserInfo, clearUserInfo, setDisplayedUser} = useContext(UserInfoActionsContext);
  return {
    updateUserInfo,
    clearUserInfo,
    setDisplayedUser,
  };
}

export const useUserInfo = () => {
  return useContext(UserInfoContext);
}
