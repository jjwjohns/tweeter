export const handler = async (event: any) => {
  return {
    success: true,
    message: "Handler reached: getfollowercountFunction",
    inputEvent: event,
  };
};
