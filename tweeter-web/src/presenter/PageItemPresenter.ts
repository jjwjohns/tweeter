import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { View, Presenter } from "./Presenter";
import { Service } from "../model/service/Service";

export const PAGE_SIZE = 10;

export interface PageItemView<T> extends View {
  addItems: (items: T[]) => void;
}

export abstract class PageItemPresenter<T, U extends Service> extends Presenter<
  PageItemView<T>
> {
  private _hasMoreItems: boolean = true;
  private _lastItem: T | null = null;
  private userService = new UserService();
  private _service: U;

  public constructor(view: PageItemView<T>) {
    super(view);
    this._service = this.serviceFactory();
  }

  protected abstract serviceFactory(): U;

  public get hasMoreItems() {
    return this._hasMoreItems;
  }

  public get lastItem() {
    return this._lastItem;
  }

  protected set hasMoreItems(hasMore: boolean) {
    this._hasMoreItems = hasMore;
  }

  protected set lastItem(item: T | null) {
    this._lastItem = item;
  }

  protected get service(): U {
    return this._service;
  }

  reset() {
    this._lastItem = null;
    this._hasMoreItems = true;
  }

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    // TODO: Replace with the result of calling server
    return this.userService.getUser(authToken, alias);
  }

  public async loadMoreItems(authToken: AuthToken, userAlias: string) {
    await this.doFailureRecordingOperation(async () => {
      const [newItems, hasMore] = await this.loadMoreItemsFromService(
        authToken!,
        userAlias
      );

      this.hasMoreItems = hasMore;
      this.lastItem =
        newItems.length > 0 ? newItems[newItems.length - 1] : null;
      this.view.addItems(newItems);
    }, "load items for " + this.itemDescription());
  }

  protected abstract itemDescription(): string;

  protected abstract loadMoreItemsFromService(
    authToken: AuthToken,
    userAlias: string
  ): Promise<[T[], boolean]>;
}
