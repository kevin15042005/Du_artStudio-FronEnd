import React, { useEffect, useState } from "react";
import Layout from "../../Components/layout";
import Footer from "../../Components/Footer/footer";
import Animacion from "../../Components/Animacion/Animacion";
import ScrollAnimadoCrud from "../../Components/ScrollAnimationCrud";
import "./Pintura.css";

const CarruselImagenes = ({ cover, nombre_Noticia_Pintura, contenido_Noticia_Pintura }) => {
  const [indexActual, setIndexActual] = useState(0);
  const [leerMas, setLeerMas] = useState(false);

  let images = [];
  try {
    const parsed = JSON.parse(cover || "[]");
    images = Array.isArray(parsed) ? parsed.map((img) => img.url) : [];
  } catch (err) {
    console.warn("⚠️ Error al parsear imágenes", cover);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setIndexActual((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  const mostrarDescripcion = leerMas
    ? contenido_Noticia_Pintura
    : contenido_Noticia_Pintura.slice(0, 100) + (contenido_Noticia_Pintura.length > 100 ? "..." : "");

  return (
    <div className="noticia-card">
      {images.length > 0 && (
        <img src={images[indexActual]} alt="Diseño" className="noticia-imagen" />
      )}
      <div className="noticia-texto">
        <h3>{nombre_Noticia_Pintura}</h3>
        <p>{mostrarDescripcion}</p>
        {contenido_Noticia_Pintura.length > 100 && (
          <button className="leer-mas-btn" onClick={() => setLeerMas(!leerMas)}>
            {leerMas ? "Ver menos" : "Leer más"}
          </button>
        )}
      </div>
    </div>
  );
};

export default function Pintura() {
  const [noticias, setNoticias] = useState([]);
  const [pagina, setPagina] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/pintura`)
      .then((res) => res.json())
      .then((data) => setNoticias(data))
      .catch((err) => console.error("Error al cargar noticias", err));
  }, []);

  const noticiasPaginadas = noticias.slice((pagina - 1) * itemsPerPage, pagina * itemsPerPage);
  const totalPaginas = Math.ceil(noticias.length / itemsPerPage);

  return (
    <>
      <Layout />
      <div className="Contenido-Principal-Pintura">
        <Animacion texto="Diseños Motocicletas" />
        <div className="Container-Pintura">
          <ul className="grid-container-pintura">
            {noticiasPaginadas.map((n, i) => (
              <ScrollAnimadoCrud key={n.id_Noticias_Pintura} delay={i * 0.1}>
                <li className="grid-item-pintura">
                  <CarruselImagenes
                    cover={n.cover}
                    nombre_Noticia_Pintura={n.nombre_Noticia_Pintura}
                    contenido_Noticia_Pintura={n.contenido_Noticia_Pintura}
                  />
                </li>
              </ScrollAnimadoCrud>
            ))}
          </ul>
          <div className="pagina-control-pintura">
            {Array.from({ length: totalPaginas }, (_, i) => (
              <button key={i + 1} onClick={() => setPagina(i + 1)} className={pagina === i + 1 ? "active" : ""}>
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
