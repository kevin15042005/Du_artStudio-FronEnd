import React from "react";
import { Link } from "react-router-dom";
import "./footer.css";

const Footer = () => {

const handleMenuTop  = ()=>{
  setMenuOpen(false);
  window.scrollTo(0,0)
}

  return (
    <div className="Footer">
      <ul className="nav-footer">
        <li>
          <Link to="/" className="nav-link" onClick={handleMenuTop}>Inicio</Link>
        </li>
        <li>
          <a href="tel:+573204916831" className="nav-link">Llámanos: 320 491 6831</a>
        </li>
        <li>
          <a href="mailto:kevin2013118@gmail.com" className="nav-link">Enviar Correo</a>
        </li>
        <li>
          <Link to="/noticias" className="nav-link" onClick={handleMenuTop}>Noticias</Link>
        </li>
        <li>
          <a href="https://maps.app.goo.gl/CiQJoSiT85ts1jsK9" target="_blank" rel="noopener noreferrer" className="nav-link">
            Ubicación
          </a>
        </li>
        <li>
          <p>Horario: L-VS: 9AM-6PM</p>
        </li>
        <li>
          <Link to="/pintura" className="nav-link" onClick={handleMenuTop}>Pintura</Link>
        </li>
        <li>
          <Link to="/contacto" className="nav-link" onClick={handleMenuTop}>Contacto</Link>
        </li>
      
      </ul>
      <div className="footer-nav">© 2025 Tu Empresa. Todos los derechos reservados.</div>
    </div>
  );
};

export default Footer;
