import { DAOFactory } from "../../factory/DAOFactory";

// Base class giving services access to DAOs without knowing concrete implementations.
export abstract class Service {
  protected get users() {
    return DAOFactory.instance.getUserDAO();
  }

  protected get authTokens() {
    return DAOFactory.instance.getAuthTokenDAO();
  }

  protected get follows() {
    return DAOFactory.instance.getFollowDAO();
  }

  protected get stories() {
    return DAOFactory.instance.getStoryDAO();
  }

  protected get feeds() {
    return DAOFactory.instance.getFeedDAO();
  }

  protected get images() {
    return DAOFactory.instance.getImageDAO();
  }
}
