import { User, AuthToken, Status } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { MessageView, Presenter, View } from "./Presenter";

export interface PostStatusView extends MessageView {
  setIsLoading: (isLoading: boolean) => void;
  setPost: (post: string) => void;
  getPost: () => string;
  getCurrentUser: () => User | null;
  getAuthToken: () => AuthToken | null;
}
export class PostStatusPresenter extends Presenter<PostStatusView> {
  public constructor(
    view: PostStatusView,
    private _service: StatusService = new StatusService()
  ) {
    super(view);
  }

  public get service() {
    return this._service;
  }

  public async submitPost(
    post: string,
    currentUser: User | null,
    authToken: AuthToken | null
  ) {
    var postingStatusToastId = "";

    await this.doFailureRecordingOperation(
      async () => {
        this.view.setIsLoading(true);
        postingStatusToastId = this.view.displayInfoMessage(
          "Posting status...",
          0
        );

        const status = new Status(post, currentUser!, Date.now());

        await this.service.postStatus(authToken!, status);

        this.view.setPost("");
        this.view.displayInfoMessage("Status posted!", 2000);
        this.view.deleteMessage(postingStatusToastId);
      },
      "post the status",
      () => {
        this.view.setIsLoading(false);
      }
    );
  }
}
