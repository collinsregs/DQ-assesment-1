// actions.js
export const setAuth = (isAuthenticated, user) => ({
  type: "SET_AUTH",
  payload: { isAuthenticated, user },
});
