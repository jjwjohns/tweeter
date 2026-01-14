// import { AuthToken, User } from "tweeter-shared";
// import {
//   PostStatusPresenter,
//   PostStatusView,
// } from "../../src/presenter/PostStatusPresenter";
// import {
//   anything,
//   capture,
//   instance,
//   mock,
//   spy,
//   verify,
//   when,
// } from "@typestrong/ts-mockito";
// import { StatusService } from "../../src/model.service/StatusService";

// describe("PostStatusPresenter", () => {
//   let mockPostStatusView: PostStatusView;
//   let postStatusPresenter: PostStatusPresenter;
//   let mockStatusService: StatusService;
//   const testUser: User = new User("first", "last", "@testuser", "image-url");
//   const testPost = "Hello World!";

//   const authToken = new AuthToken("test-token", Date.now());

//   beforeEach(() => {
//     mockPostStatusView = mock<PostStatusView>();
//     const mockPostStatusViewInstance = instance(mockPostStatusView);
//     when(mockPostStatusView.displayInfoMessage(anything(), 0)).thenReturn(
//       "toast-id"
//     );

//     const postStatusPresenterSpy = spy(
//       new PostStatusPresenter(mockPostStatusViewInstance)
//     );
//     postStatusPresenter = instance(postStatusPresenterSpy);

//     mockStatusService = mock<StatusService>();
//     when(postStatusPresenterSpy.service).thenReturn(
//       instance(mockStatusService)
//     );
//   });

//   it("tells the view to display a posting status message", async () => {
//     await postStatusPresenter.submitPost("Hello World!", null, authToken);
//     verify(
//       mockPostStatusView.displayInfoMessage("Posting status...", 0)
//     ).once();
//   });

//   it("calls postStatus on the status service with the correct status and auth token", async () => {
//     await postStatusPresenter.submitPost("Hello World!", testUser, authToken);
//     verify(mockStatusService.postStatus(authToken, anything())).once();
//   });

//   it("the presenter tells the view to clear the info message that was displayed previously, clear the post, and display a status posted message, when successful.", async () => {
//     await postStatusPresenter.submitPost("Hello World!", testUser, authToken);

//     verify(mockPostStatusView.deleteMessage("toast-id")).once();
//     verify(mockPostStatusView.setPost("")).once();
//     verify(
//       mockPostStatusView.displayInfoMessage("Status posted!", 2000)
//     ).once();
//   });

// it("the presenter tells the view to display an error message and does not tell it to clear the info message or clear the post when unsuccessful.", async () => {
//     when(mockStatusService.postStatus(anything(), anything())).thenReject(new Error("Post failed"));
//     await postStatusPresenter.submitPost("Hello World!", testUser, authToken);

//     verify(mockPostStatusView.displayErrorMessage("Failed to post the status because of exception: Error: Post failed")).once();
//     verify(mockPostStatusView.deleteMessage(anything())).never();
//     verify(mockPostStatusView.setPost("")).never();
// });
// });
