import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import NavbarNoticia from "../NavbarNoticias/NavbarNoticias";

const Layout = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoging");
    setIsLoggedIn(loginStatus === "true");
  }, []);

  return (
    <div className="Main">
      {isLoggedIn ? <NavbarNoticia /> : <Navbar />}
      {children}
    </div>
  );
};

export default Layout;
