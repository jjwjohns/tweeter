import "./UserInfoComponent.css";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "./UserInfoHooks";
import { UserInfoPresenter, UserInfoView } from "../../presenter/UserInfoPresenter";

const UserInfo = () => {
  const [isFollower, setIsFollower] = useState(false);
  const [followeeCount, setFolloweeCount] = useState(-1);
  const [followerCount, setFollowerCount] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const { displayInfoMessage, displayErrorMessage, deleteMessage } = useMessageActions();
  const { currentUser, authToken, displayedUser } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const navigate = useNavigate();
  const location = useLocation();

  const getBaseUrl = (): string => {
    const segments = location.pathname.split("/@");
    return segments.length > 1 ? segments[0] : "/";
  };
  
  const view: UserInfoView = {
    setIsFollower,
    setFolloweeCount,
    setFollowerCount,
    setIsLoading,
    displayInfoMessage,
    displayErrorMessage,
    deleteMessage,
    navigateToUser: (alias) => navigate(`${getBaseUrl()}/@${alias}`),
    getCurrentUser: () => currentUser,
    getDisplayedUser: () => displayedUser,
    setDisplayedUser,
  };

  const presenter = new UserInfoPresenter(view);

  useEffect(() => {
    if (displayedUser && authToken) presenter.initialize(authToken);
  }, [displayedUser]);

  if (!currentUser || !displayedUser || !authToken) return <></>;

  return (
    <div className="container">
      <div className="row">
        <div className="col-auto p-3">
          <img src={displayedUser.imageUrl} className="img-fluid" width="100" alt="User" />
        </div>

        <div className="col p-3">
          {!displayedUser.equals(currentUser) && (
            <p id="returnToLoggedInUser">
              Return to{" "}
              <Link to={`./${currentUser.alias}`} onClick={(e) => { e.preventDefault(); presenter.switchToLoggedInUser(); }}>
                logged in user
              </Link>
            </p>
          )}
          <h2><b>{displayedUser.name}</b></h2>
          <h3>{displayedUser.alias}</h3>
          <br />
          {followeeCount > -1 && followerCount > -1 && (
            <div>Followees: {followeeCount} Followers: {followerCount}</div>
          )}
        </div>

        {!displayedUser.equals(currentUser) && (
          <form className="form-group">
            {isFollower ? (
              <button
                id="unFollowButton"
                className="btn btn-md btn-secondary me-1"
                type="submit"
                style={{ width: "6em" }}
                onClick={(e) => { e.preventDefault(); presenter.unfollowUser(authToken); }}
              >
                {isLoading ? <span className="spinner-border spinner-border-sm" /> : <div>Unfollow</div>}
              </button>
            ) : (
              <button
                id="followButton"
                className="btn btn-md btn-primary me-1"
                type="submit"
                style={{ width: "6em" }}
                onClick={(e) => { e.preventDefault(); presenter.followUser(authToken); }}
              >
                {isLoading ? <span className="spinner-border spinner-border-sm" /> : <div>Follow</div>}
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default UserInfo;