const getTokenFromLocalStorage = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

export const config = {
  headers: {
    Authorization: `Bearer ${
      getTokenFromLocalStorage !== null
        ? getTokenFromLocalStorage.access_token
        : ""
    }`,
    Accept: "application/json",
    "ngrok-skip-browser-warning": "69420",
  },
};
