import { User, AuthToken, Status } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";
import { MessageView, Presenter, View } from "./Presenter";

export interface PostStatusView extends MessageView{
    setIsLoading: (isLoading: boolean) => void;
    setPost: (post: string) => void;
    getPost: () => string;
    getCurrentUser: () => User | null;
    getAuthToken: () => AuthToken | null;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
    private _service = new StatusService();

    public constructor(view: PostStatusView) {
        super(view);
    }

    public get service() {
        return this._service;
    }

    public async submitPost(post: string, currentUser: User | null, authToken: AuthToken | null) {
        var postingStatusToastId = "";

        await this.doFailureRecordingOperation(async () => {
          this.view.setIsLoading(true);
          postingStatusToastId = this.view.displayInfoMessage("Posting status...", 0);
    
          const status = new Status(post, currentUser!, Date.now());
    
          await this.service.postStatus(authToken!, status);
    
          this.view.setPost("");
          this.view.displayInfoMessage("Status posted!", 2000);
        },
        "Failed to post the status.",
        () => {
          this.view.deleteMessage(postingStatusToastId);
          this.view.setIsLoading(false);
        });
    }
}