import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isLogin = localStorage.getItem("isLogin");
  const user = localStorage.getItem("user");

  if (isLogin !== "true" || !user) {
    return <Navigate to="/" replace />;
  }

  // Si está logueado, permite acceder a los hijos
  return children;
};

export default ProtectedRoute;
