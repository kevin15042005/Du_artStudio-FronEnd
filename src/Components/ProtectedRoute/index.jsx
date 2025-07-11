// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn === null) return null;
  return isLoggedIn ? children : <Navigate to="/Loging" replace />;
};

export default ProtectedRoute;
