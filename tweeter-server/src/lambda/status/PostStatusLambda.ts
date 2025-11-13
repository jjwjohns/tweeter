export const handler = async (event: any) => {
  return {
    success: true,
    message: "Handler reached: postStatusFunction",
    inputEvent: event,
  };
};
