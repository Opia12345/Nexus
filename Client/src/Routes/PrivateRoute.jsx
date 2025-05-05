import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const userId = JSON.parse(localStorage.getItem("user"))?.userId;

  if (!userId) {
    return <Navigate to="/err" />;
  }
  return children;
};
export default PrivateRoute;
