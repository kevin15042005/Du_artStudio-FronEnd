import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import NavbarNoticia from "../NavbarNoticias/NavbarNoticias";
const Layout = ({ children }) => {
const isLoging = localStorage.getItem("isLoging");

  return (
    <div className="Main">
      {isLoging === "true" ? <NavbarNoticia /> : <Navbar />}
      {children}
    </div>
  );
};

export default Layout;
