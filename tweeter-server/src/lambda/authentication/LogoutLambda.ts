export const handler = async (event: any) => {
  return {
    success: true,
    message: "Handler reached: logoutFunction",
    inputEvent: event,
  };
};
