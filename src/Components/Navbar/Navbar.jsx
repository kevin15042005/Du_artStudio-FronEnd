import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import CarritoPopup from "../CarritoPopup/CarritoPopup";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCarrito } from "../CarritoContext/CarritoContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { carrito } = useCarrito();
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Cerrar menú al hacer clic en un enlace
  const handleMenuClick = () => {
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  // Efecto para cambiar estilo al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav>
      <div className="General-Navbar">
        <div className="Fondo-Navbar">
          <div className={`nav ${isScrolled ? "nav-scrolled" : ""}`}>
            <div className="nav-container">
                          <button 
                className="menu-icon" 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Menú"
              >
                {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
              </button>

              {/* Menú de navegación */}
              <ul className={`nav-menu ${isMenuOpen ? "nav-menu-active" : ""}`}>
                <li className="Transicion-navbar" onClick={handleMenuClick}>
                  <Link to="/" className="colorTexto">Inicio</Link>
                </li>
                <li className="Transicion-navbar" onClick={handleMenuClick}>
                  <Link to="/pintura" className="colorTexto">Pintura</Link>
                </li>
                <li className="Transicion-navbar" onClick={handleMenuClick}>
                  <Link to="/noticias" className="colorTexto">Noticias</Link>
                </li>
                <li className="Transicion-navbar" onClick={handleMenuClick}>
                  <Link to="/Compra" className="colorTexto">Shop</Link>
                </li>
                <li className="Transicion-navbar" onClick={handleMenuClick}>
                  <Link to="/Nosotros" className="colorTexto">Ubicacion</Link>
                </li>
                <li className="Transicion-navbar" onClick={handleMenuClick}>
                  <Link to="/Contacto" className="colorTexto">Contacto</Link>
                </li>
                <li className="Transicion-navbar" onClick={handleMenuClick}>
                  <Link to="/loging" className="colorTexto">Ingreso</Link>
                </li>
              </ul>

              {/* Ícono de carrito - Siempre visible */}
              <div 
                className="carrito-navbar" 
                onClick={() => {
                  setMostrarPopup(true);
                  setIsMenuOpen(false);
                }}
                aria-label="Carrito de compras"
              >
                <ShoppingCart />
                {carrito.length > 0 && (
                  <span className="contador-carrito">
                    {carrito.length > 9 ? '9+' : carrito.length}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <CarritoPopup
        mostrar={mostrarPopup}
        cerrar={() => setMostrarPopup(false)}
      />
    </nav>
  );
};

export default Navbar;