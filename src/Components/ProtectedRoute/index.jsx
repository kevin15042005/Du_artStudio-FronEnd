import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isLoging = localStorage.getItem("isLoging");

  // Si no está logueado, redirige a inicio
  if (isLoging !== "true") {
    return <Navigate to="/" replace />;
  }

  // Si está logueado, permite acceder a los hijos
  return children;
};

export default ProtectedRoute;
