import { Link } from "react-router-dom";
import { User } from "tweeter-shared";
import useUserNavigation from "./NavigateUserHook";

interface Props {
  item: User;
  featurePath: string;
}

const UserItem = (props: Props) => {
  const { navigateToUser } = useUserNavigation({ featurePath: props.featurePath });

  return (
    <div className="col bg-light mx-0 px-0">
      <div className="container px-0">
        <div className="row mx-0 px-0">
          <div className="col-auto p-3">
            <img
              src={props.item.imageUrl}
              className="img-fluid"
              width="80"
              alt="Posting user"
            />
          </div>
          <div className="col">
            <h2>
              <b>
                {props.item.firstName} {props.item.lastName}
              </b>{" "}
              -{" "}
              <Link
                to={`${props.featurePath}/${props.item.alias}`}
                onClick={navigateToUser}
              >
                {props.item.alias}
              </Link>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserItem;
