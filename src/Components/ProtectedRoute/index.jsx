// src/Components/ProtectedRoute/index.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext.jsx";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/Loging" replace />;
  }

  return children;
};

export default ProtectedRoute;
