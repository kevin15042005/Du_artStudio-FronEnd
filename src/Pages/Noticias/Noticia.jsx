import React, { useState, useEffect } from "react";
import Layout from "../../Components/layout";
import Footer from "../../Components/Footer/footer";
import "./Noticias.css";
import ScrollAnimation from "../../Components/ScrollAnimationCrud/index";
import Animacion from "../../Components/Animacion/Animacion";

function CarruselImagenes({ cover, nombre_Noticias, contenido_Noticia }) {
  const [imagenes, setImagenes] = useState([]);
  const [indexActual, setIndexActual] = useState(0);
  const [leerMas, setLeerMas] = useState(false);
  const maxLength = 120;

  useEffect(() => {
    try {
      const parsed = JSON.parse(cover); // intenta como JSON (Cloudinary)
      const urls = parsed.map((img) => img.url);
      setImagenes(urls);
    } catch {
      const split = cover?.split(",") || []; // como texto plano
      const urls = split.map((name) => `${import.meta.env.VITE_API_URL}/uploads/${name}`);
      setImagenes(urls);
    }
  }, [cover]);

  useEffect(() => {
    if (imagenes.length > 1) {
      const interval = setInterval(() => {
        setIndexActual((prev) => (prev + 1) % imagenes.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [imagenes]);

  if (!imagenes.length) return null;

  const esLargo = contenido_Noticia.length > maxLength;
  const textoCorto = contenido_Noticia.slice(0, maxLength);

  return (
    <div className={`noticia-card ${leerMas ? "expandido" : ""}`}>
      <img
        src={imagenes[indexActual]}
        alt={`Noticia: ${nombre_Noticias}`}
        className="noticia-imagen"
      />
      <div className="noticia-texto">
        <h3>{nombre_Noticias}</h3>
        <div className="contenido-noticia">
          <p>{leerMas || !esLargo ? contenido_Noticia : `${textoCorto}...`}</p>
        </div>
        {esLargo && (
          <button className="leer-mas-btn" onClick={() => setLeerMas(!leerMas)}>
            {leerMas ? "Ver menos" : "Leer más"}
          </button>
        )}
      </div>
    </div>
  );
}


export default function Noticias() {
  const [noticias, setNoticias] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/noticias`)
      .then((res) => res.json())
      .then((data) => setNoticias(data))
      .catch((err) => console.log(err));
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = noticias.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(noticias.length / itemsPerPage);

  return (
    <>
      <div id="main-container">
        <Layout />
        <div className="Contenido-Principal">
          <div className="Informacion-Noticia">
            <Animacion texto="Noticias publicadas" className="titulo-Noticia" />
            <div className="Informacion-RelevanteGeneralNoticia">
              <section className="InformacionRelevanteNoticia">
                <h2>Información Relevante</h2>
                <p>
                  Aquí se mostrarán noticias importantes sobre eventos,
                  comunidad y novedades del mundo de la motovelocidad.
                </p>
              </section>
            </div>
          </div>
          <div className="Container-noticia">
            <ul className="grid-container-noticia">
              {currentItems.map((noticia, index) => (
                <ScrollAnimation key={noticia.id_Noticia} delay={index * 0.2}>
                  <li className="grid-item-noticia">
                    <CarruselImagenes
                      cover={noticia.cover}
                      nombre_Noticias={noticia.nombre_Noticias}
                      contenido_Noticia={noticia.contenido_Noticia}
                    />
                  </li>
                </ScrollAnimation>
              ))}
            </ul>
            <div className="pagina-control">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (number) => (
                  <button
                    key={number}
                    onClick={() => setCurrentPage(number)}
                    className={`pagination-button ${
                      currentPage === number ? "active" : ""
                    }`}
                  >
                    {number}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
