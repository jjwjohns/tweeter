/**
 * Integration test for Milestone 4B
 * Goal: Verify posting a status appends it to the user's story.
 *
 * Requirements (from spec):
 * 1) Login a user (via ServerFacade or client-side service)
 * 2) Post a status via the Presenter
 * 3) Verify "Successfully Posted!" was displayed
 * 4) Retrieve story and verify new status is appended + details correct
 */

import { instance, mock, spy, verify } from "ts-mockito";
import { ServerFacade } from "../src/network/ServerFacade"; // adjust path
import { AuthToken, User } from "tweeter-shared"; // adjust if your shared import differs

// ---- Adjust these imports to match your project ----
import { StatusService } from "../src/model/service/StatusService"; // client-side service the presenter uses
import { PostStatusPresenter } from "../src/presenter/PostStatusPresenter"; // or whatever your presenter class is
import { PostStatusView } from "../src/presenter/PostStatusPresenter"; // interface type your presenter calls

import fetch from "cross-fetch";
(global as any).fetch = fetch;

describe("Milestone 4B - Post Status Integration Test", () => {
  let serverFacadeSpy: ServerFacade;
  let statusService: StatusService;

  let presenter: PostStatusPresenter;

  let mockView: PostStatusView;

  let authToken: AuthToken;
  let testUser: User;

  beforeEach(() => {
    const serverFacade: ServerFacade = new ServerFacade();
    serverFacadeSpy = spy(serverFacade);

    statusService = new StatusService(serverFacade);

    mockView = mock<PostStatusView>();

    presenter = new PostStatusPresenter(instance(mockView), statusService);
  });

  afterEach(async () => {
    jest.clearAllMocks();

    if (authToken && testUser) {
      const logoutRequest = {
        alias: testUser.alias,
        password: "password",
        token: authToken.token,
      };
      await instance(serverFacadeSpy).logout(logoutRequest);
    }
  }, 10000);

  it("should append a posted status to the user's story", async () => {
    // Step 1: Login
    const loginRequest = {
      alias: "@test",
      password: "test",
    };

    const loginResponse = await instance(serverFacadeSpy).login(loginRequest);
    authToken = loginResponse[1];
    testUser = loginResponse[0];
    let start = Date.now();

    expect(testUser).toBeDefined();
    expect(authToken).toBeDefined();
    verify(serverFacadeSpy.login(loginRequest)).once();

    // Step 2: Post Status
    await presenter.submitPost("Hello from Milestone 4B!", testUser, authToken);

    // Step 3: Verify "Successfully Posted!" was displayed
    verify(mockView.displayInfoMessage("Status posted!", 2000)).once();

    // Step 4: Retrieve Story and verify new status
    const storyResponse = await instance(serverFacadeSpy).getMoreStoryItems({
      token: authToken.token,
      userAlias: testUser.alias,
      pageSize: 10,
      lastItem: null,
    });

    expect(storyResponse[0].length).toBeGreaterThan(0);
    expect(storyResponse[0][0].post).toBe("Hello from Milestone 4B!");
    expect(storyResponse[0][0].user.alias).toBe(testUser.alias);
    expect(storyResponse[0][0].timestamp).toBeGreaterThanOrEqual(start);
  }, 15000);
});
