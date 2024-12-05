import { Navigate } from "react-router-dom";

export const OpenRoutes = ({ children }) => {
  const getTokenFromLocalStorage = localStorage.getItem("access_token");
  console.log(
    "🚀 ~ OpenRoutes ~ getTokenFromLocalStorage:",
    getTokenFromLocalStorage
  );
  return !getTokenFromLocalStorage ? (
    children
  ) : (
    <Navigate to="/admin" replace={true} />
  );
};
