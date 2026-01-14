// import "isomorphic-fetch";
// import { StatusService } from "../../src/model/service/StatusService";
// import { AuthToken, User } from "tweeter-shared";

// describe("StatusService Integration Test", () => {
//   const service = new StatusService();

//   test("loadMoreStoryItems returns status list + hasMore flag", async () => {
//     const fakeUser = new User("Allen", "Anderson", "@allen", "url");
//     const fakeAuth = new AuthToken("dummy-token", Date.now());

//     const pageSize = 10;

//     const [items, hasMore] = await service.loadMoreStoryItems(
//       fakeAuth,
//       fakeUser.alias,
//       pageSize,
//       null
//     );

//     expect(items).not.toBeNull();
//     expect(items.length).toBeGreaterThan(0);
//     expect(typeof hasMore).toBe("boolean");

//     const first = items[0];
//     expect(first.post).toBeDefined();
//     expect(first.user.alias).toBe("@allen"); // from FakeData
//   });
// });
