import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import ItemScroller from "./components/mainLayout/ItemScroller";
import { useUserInfo } from "./components/userInfo/UserInfoHooks";
import { FolloweePresenter } from "./presenter/FolloweePresenter";
import { FollowerPresenter } from "./presenter/FollowerPresenter";
import { StoryPresenter } from "./presenter/StoryPresenter";
import { FeedPresenter } from "./presenter/FeedPresenter";
import { PageItemPresenter, PageItemView } from "./presenter/PageItemPresenter";
import { Status, User } from "tweeter-shared";
import { StatusService } from "./model.service/StatusService";
import StatusItem from "./components/statusItem/StatusItem";
import UserItem from "./components/userItem/UserItem";
import { FollowService } from "./model.service/FollowService";
import { Service } from "./model.service/Service";

const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

function makeItemRoute<TItem, TService extends Service>(
  path: string,
  featurePath: string,
  displayedUserAlias: string,
  presenterFactory: (view: PageItemView<TItem>) => PageItemPresenter<TItem, TService>,
  ItemComponent: React.ComponentType<{ item: TItem; featurePath: string }>
) {
  return (
    <Route
      key={`${path}-${displayedUserAlias}`}
      path={`${path}/:displayedUser`}
      element={
        <ItemScroller<TItem, TService>
          key={`${path}-${displayedUserAlias}`}
          featurePath={featurePath}
          presenterFactory={presenterFactory}
          ItemComponent={ItemComponent}
        />
      }
    />
  );
}

const AuthenticatedRoutes = () => {
  const { displayedUser } = useUserInfo();

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to={`/feed/${displayedUser!.alias}`} />} />
        {makeItemRoute(
          "feed",
          "/feed",
          displayedUser!.alias,
          (view) => new FeedPresenter(view),
          StatusItem
        )}
        {makeItemRoute(
          "story",
          "/story",
          displayedUser!.alias,
          (view) => new StoryPresenter(view),
          StatusItem
        )}
        {makeItemRoute(
          "followees",
          "/followees",
          displayedUser!.alias,
          (view) => new FolloweePresenter(view),
          UserItem
        )}
        {makeItemRoute(
          "followers",
          "/followers",
          displayedUser!.alias,
          (view) => new FollowerPresenter(view),
          UserItem
        )}
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={`/feed/${displayedUser!.alias}`} />} />
      </Route>
    </Routes>
  );
}; 

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login originalUrl={location.pathname} />} />
    </Routes>
  );
};

export default App;
