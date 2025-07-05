import React, { useState, useEffect } from "react";
import Layout from "../../Components/layout";
import Footer from "../../Components/Footer/footer";
import "./Noticias.css";
import ScrollAnimation from "../../Components/ScrollAnimationCrud/index";
import Animacion from "../../Components/Animacion/Animacion";

function CarruselImagenes({ cover, nombre_Noticias, contenido_Noticia }) {
  const [indexActual, setIndexActual] = useState(0);
  const [leerMas, setLeerMas] = useState(false);
  const maxLength = 120;

  let coverArray = [];

  try {
    coverArray = Array.isArray(cover) ? cover : JSON.parse(cover || "[]");
  } catch (err) {
    console.error("❌ Error al parsear cover:", cover);
    coverArray = [];
  }

  useEffect(() => {
    if (coverArray.length > 0) {
      const intervalo = setInterval(() => {
        setIndexActual((prev) => (prev + 1) % coverArray.length);
      }, 3000);
      return () => clearInterval(intervalo);
    }
  }, [coverArray.length]);

  if (coverArray.length === 0) return null;

  const esLargo = contenido_Noticia.length > maxLength;
  const textoCorto = contenido_Noticia.slice(0, maxLength);

  return (
    <div className={`noticia-card ${leerMas ? "expandido" : ""}`}>
      <img
        src={coverArray[indexActual]?.url}
        alt={`Noticia: ${nombre_Noticias}`}
        className="noticia-imagen"
      />
      <div className="noticia-texto">
        <h3>{nombre_Noticias}</h3>
        <div className="contenido-noticia">
          <p>{leerMas || !esLargo ? contenido_Noticia : `${textoCorto}...`}</p>
        </div>
        {esLargo && (
          <button
            className="leer-mas-btn"
            onClick={() => setLeerMas(!leerMas)}
          >
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
            <section className="InformacionRelevanteNoticia">
              <h2>Información Relevante</h2>
              <p>
                Aquí se mostrarán noticias importantes sobre eventos,
                comunidad y novedades del mundo de la motovelocidad.
              </p>
            </section>
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
