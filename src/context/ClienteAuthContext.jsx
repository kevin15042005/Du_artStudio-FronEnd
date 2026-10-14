// context/ClienteAuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const ClienteAuthContext = createContext();

export const ClienteAuthProvider = ({ children }) => {
  const [clienteActual, setClienteActual] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const guardado = localStorage.getItem("cliente");
    if (guardado) {
      try {
        setClienteActual(JSON.parse(guardado));
      } catch {
        localStorage.removeItem("cliente");
      }
    }
    setCargando(false);
  }, []);

  const registerCliente = async ({ nombre_Cliente, correo_Cliente, contraseña_Cliente, telefono_Cliente }) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/cliente/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre_Cliente, correo_Cliente, contraseña_Cliente, telefono_Cliente }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "No se pudo crear la cuenta");
    return data;
  };

  const loginCliente = async (correo_Cliente, contraseña_Cliente) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/cliente/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo_Cliente, contraseña_Cliente }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Credenciales inválidas");

    setClienteActual(data.cliente);
    localStorage.setItem("cliente", JSON.stringify(data.cliente));
    return data.cliente;
  };

  const logoutCliente = () => {
    setClienteActual(null);
    localStorage.removeItem("cliente");
  };

  return (
    <ClienteAuthContext.Provider
      value={{ clienteActual, cargando, registerCliente, loginCliente, logoutCliente }}
    >
      {children}
    </ClienteAuthContext.Provider>
  );
};

export const useClienteAuth = () => useContext(ClienteAuthContext);
