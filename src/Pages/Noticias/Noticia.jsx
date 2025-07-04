import React, { useState, useEffect } from "react";
import Layout from "../../Components/layout";
import Footer from "../../Components/Footer/footer";
import "./Noticias.css";
import ScrollAnimation from "../../Components/ScrollAnimationCrud/index";
import Animacion from "../../Components/Animacion/Animacion";

function CarruselImagenes({ cover, nombre_Noticias, contenido_Noticia, isExpanded, onToggle }) {
  const images = cover ? cover.split(",") : [];
  const [indexActual, setIndexActual] = useState(0);
  const maxLength = 120;

  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndexActual((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(intervalo);
  }, [images.length]);

  if (images.length === 0) return null;

  const esLargo = contenido_Noticia.length > maxLength;
  const textoCorto = contenido_Noticia.slice(0, maxLength);

  return (
    <div className={`noticia-card ${isExpanded ? "expandido" : ""}`}>
      <img
        src={`${import.meta.env.VITE_API_URL}/uploads/${images[indexActual]}`}
        alt={`Noticia: ${nombre_Noticias}`}
        className="noticia-imagen"
      />
      <div className="noticia-texto">
        <h3>{nombre_Noticias}</h3>
        <div className="contenido-noticia">
          <p>{isExpanded || !esLargo ? contenido_Noticia : `${textoCorto}...`}</p>
        </div>
        {esLargo && (
          <button className="leer-mas-btn" onClick={onToggle}>
            {isExpanded ? "Ver menos" : "Leer más"}
          </button>
        )}
      </div>
    </div>
  );
}

export default function Noticias() {
  const [noticias, setNoticias] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState({});
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

  // Agrupar noticias por filas (3 por fila)
  const rows = [];
  for (let i = 0; i < currentItems.length; i += 3) {
    rows.push(currentItems.slice(i, i + 3));
  }

  const toggleRow = (rowIndex) => {
    setExpandedRows(prev => ({
      ...prev,
      [rowIndex]: !prev[rowIndex]
    }));
  };

  return (
    <>
      <div id="main-container">
        <Layout />
        <div className="Contenido-Principal">
          <div className="Informacion-Noticia">
            <Animacion texto="Noticias publicadas" className="titulo-Noticia" />
            <div className="Informacion-RelevanteGeneral-Noticia">
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
            <div className="Contenedor-principal">
              <div className="grid-container-noticia">
                {rows.map((row, rowIndex) => (
                  <div key={rowIndex} className="grid-row">
                    {row.map((noticia, index) => (
                      <ScrollAnimation key={noticia.id_Noticia} delay={index * 0.2}>
                        <div className="grid-item-noticia">
                          <CarruselImagenes
                            cover={noticia.cover}
                            nombre_Noticias={noticia.nombre_Noticias}
                            contenido_Noticia={noticia.contenido_Noticia}
                            isExpanded={expandedRows[rowIndex]}
                            onToggle={() => toggleRow(rowIndex)}
                          />
                        </div>
                      </ScrollAnimation>
                    ))}
                  </div>
                ))}
              </div>
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
        </div>
        <footer>
          <Footer />
        </footer>
      </div>
    </>
  );
}