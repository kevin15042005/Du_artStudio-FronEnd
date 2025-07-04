import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./NavbarNoticias.css";
import { Menu, X } from "lucide-react";


const NavbarNoticia = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Cierra menú y vuelve al inicio al hacer clic
  const handleMenuClick = () => {
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  // Detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav>
      <div className="General-NavbarNoticias">
        <div className="Fondo-NavbarNoticias">
          <div className={`navbar-noticias ${isScrolled ? "navbar-noticias-scrolled" : ""}`}>
            <div className="navbar-noticias-container">

              {/* Ícono Menú Responsive */}
              <button
                className="menu-icon-noticias"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Menú"
              >
                {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
              </button>

              {/* Menú de Navegación */}
              <ul className={`navbar-noticias-menu ${isMenuOpen ? "navbar-noticias-menu-active" : ""}`}>
                <li onClick={handleMenuClick}>
                  <Link to="/Aliados" className="colorTexto">Aliados</Link>
                </li>
                <li onClick={handleMenuClick}>
                  <Link to="/CrudNoticias" className="colorTexto">Noticias</Link>
                </li>
                <li onClick={handleMenuClick}>
                  <Link to="/CrudNoticiasPintura" className="colorTexto">Pintura</Link>
                </li>
                <li onClick={handleMenuClick}>
                  <Link to="/Shop" className="colorTexto">Shop</Link>
                </li>
                <li onClick={handleMenuClick}>
                  <Link to="/Registrar" className="colorTexto">Registrar</Link>
                </li>
                <li onClick={handleMenuClick}>
                  <button
                    className="Cerrar-Sesion"
                    onClick={() => {
                      localStorage.clear();
                      window.location.href = "/";
                    }}
                  >
                    Cerrar Sesión
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarNoticia;
