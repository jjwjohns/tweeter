"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const handler = async (event) => {
    return {
        success: true,
        message: "Handler reached: getFolloweesFunction",
        inputEvent: event,
    };
};
exports.handler = handler;
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
