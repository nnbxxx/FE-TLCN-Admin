import { Navigate } from "react-router-dom";

export const PrivateRoutes = ({ children }) => {
  const getTokenFromLocalStorage = localStorage.getItem("access_token");

  return getTokenFromLocalStorage ? (
    children
  ) : (
    <Navigate to="/" replace={true} />
  );
};
