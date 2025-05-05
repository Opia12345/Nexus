import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

const PrivateRoute = ({ children }) => {
  const userId = JSON.parse(localStorage.getItem("user"))?.userID;

  if (!userId) {
    return <Navigate to="/err" />;
  }
  return children;
};
export default PrivateRoute;
