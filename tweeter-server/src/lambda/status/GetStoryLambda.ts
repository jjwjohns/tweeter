export const handler = async (event: any) => {
  return {
    success: true,
    message: "Handler reached: loadMoreStoryItemsFunction",
    inputEvent: event,
  };
};
