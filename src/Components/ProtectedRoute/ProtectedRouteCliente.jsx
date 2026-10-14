// Components/ProtectedRoute/ProtectedRouteCliente.jsx
import { Navigate } from "react-router-dom";
import { useClienteAuth } from "../../context/ClienteAuthContext";

const ProtectedRouteCliente = ({ children }) => {
  const { clienteActual, cargando } = useClienteAuth();

  if (cargando) return null;
  return clienteActual ? children : <Navigate to="/ClienteLogin" replace />;
};

export default ProtectedRouteCliente;
