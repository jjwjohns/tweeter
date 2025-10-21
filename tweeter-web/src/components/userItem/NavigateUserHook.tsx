import { useNavigate } from "react-router-dom";
import { AuthToken, User, FakeData } from "tweeter-shared";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserInfoHooks";
import { UserService } from "../../model.service/UserService";


interface Props {
    featurePath: string;
}

const useUserNavigation = ({ featurePath }: Props) => {
    const service = new UserService();
    const { displayErrorMessage } = useMessageActions();
    const { displayedUser, authToken } = useUserInfo();
    const { setDisplayedUser } = useUserInfoActions();

    const navigate = useNavigate();

    const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
        event.preventDefault();

        try {
        const alias = extractAlias(event.target.toString());

        const toUser = await service.getUser(authToken!, alias);

        if (toUser) {
            if (!toUser.equals(displayedUser!)) {
            setDisplayedUser(toUser);
            navigate(`${featurePath}/${toUser.alias}`);
            }
        }
        } catch (error) {
            displayErrorMessage(
                `Failed to get user because of exception: ${error}`
            );
        }
    };

        return { navigateToUser };
    };

    const extractAlias = (value: string): string => {
        const index = value.indexOf("@");
        return value.substring(index);
    };

export default useUserNavigation;