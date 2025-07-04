import React from "react";
import Navbar from "../Navbar/Navbar";
import NavbarNoticia from "../NavbarNoticias/NavbarNoticias";
import { useAuth } from "../AuthContext/AuthContext.jsx";

const Layout = ({ children }) => {
  const { isLoggedIn } = useAuth();

  return (
    <div className="Main">
      {isLoggedIn ? <NavbarNoticia /> : <Navbar />}
      {children}
    </div>
  );
};

export default Layout;
