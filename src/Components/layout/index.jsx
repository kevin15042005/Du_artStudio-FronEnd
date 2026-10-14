import React from "react";
import Navbar from "../Navbar/Navbar";
import NavbarNoticia from "../NavbarNoticias/NavbarNoticias";
import { useAuth } from "../../context/AuthContext.jsx";
import WhatsAppButtom from "../WhatsApp/WhatsApp.jsx"
import ChatBot from "../ChatBot/ChatBot.jsx";
const Layout = ({ children }) => {
  const { isLoggedIn } = useAuth();

  return (
    <div className="Main">
      {isLoggedIn ? <NavbarNoticia /> : <Navbar />}
      {children}
      <WhatsAppButtom/>
      <ChatBot />
    </div>
  );
};

export default Layout;
