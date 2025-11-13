import { PagedUserItemRequest } from "tweeter-shared";
import { PagedUserItemResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (event: any) => {
  return {
    success: true,
    message: "Handler reached: getFolloweesFunction",
    inputEvent: event,
  };
};

// export const handler = async (
//   request: PagedUserItemRequest
// ): Promise<PagedUserItemResponse> => {
//   const followService = new FollowService();

//   const [items, hasMore] = await followService.loadMoreFollowees(
//     request.token,
//     request.userAlias,
//     request.pageSize,
//     request.lastItem || null
//   );

//   return {
//     success: true,
//     message: null,
//     items: items,
//     hasMore: hasMore,
//   };
// };
