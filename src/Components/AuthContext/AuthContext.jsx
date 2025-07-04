// src/Components/AuthContext/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem("isLoging");
    setIsLoggedIn(session === "true");
  }, []);

  const login = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoging", "true");
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.setItem("isLoging", "false");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
