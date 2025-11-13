export const handler = async (event: any) => {
  return {
    success: true,
    message: "Handler reached: loadMoreFeetItemsFunction",
    inputEvent: event,
  };
};
