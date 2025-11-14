import "isomorphic-fetch";
import { ServerFacade } from "../../src/network/ServerFacade";
import { RegisterRequest } from "tweeter-shared";

describe("ServerFacade Integration Tests", () => {
  const facade = new ServerFacade();

  test("Register returns user + token", async () => {
    const request: RegisterRequest = {
      firstName: "John",
      lastName: "Doe",
      alias: "@johndoe12345",
      password: "password",
      userImageBytes: new Uint8Array([1, 2, 3]),
      imageFileExtension: "jpg",
    };

    const [user, token] = await facade.register(request);
    console.log(user);

    // Validate returned user and token
    // Assertions are from fake data and so they don't match the input
    expect(user.alias).toBe("@allen");
    expect(user.firstName).toBe("Allen");
    expect(user.lastName).toBe("Anderson");
    expect(token.token).toBeDefined();
  });

  test("GetFollowers returns list of followers", async () => {
    const request = {
      token: "dummy-token",
      userAlias: "@allen",
      pageSize: 10,
      lastItem: null,
    };

    const [followers, hasMore] = await facade.getMoreFollowers(request);

    expect(followers.length).toBeGreaterThan(0);
    expect(typeof hasMore).toBe("boolean");
  });

  test("GetFollowerCount returns a valid number", async () => {
    const request = {
      token: "dummy-token",
      selectedUser: {
        firstName: "Test",
        lastName: "User",
        alias: "@testuser",
        imageUrl: "http://example.com/image.jpg",
      },
    };

    const response = await facade.getFollowerCount(request);
    expect(response.success).toBe(true);
    console.log(response.number);
    expect(response.number).toBeDefined();
  });
});
