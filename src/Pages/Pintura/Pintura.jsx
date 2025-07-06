import React, { useEffect, useState } from "react";
import Layout from "../../Components/layout/index.jsx";
import Footer from "../../Components/Footer/footer.jsx";
import "./Pintura.css";
import ScrollAnimadoCrud from "../../Components/ScrollAnimationCrud/index.jsx";
import moto from "../../assets/cf1.jpeg";
import moto1 from "../../assets/cf2.jpeg";
import moto2 from "../../assets/cf3.jpeg";
import Animacion from "../../Components/Animacion/Animacion.jsx";

const Pintura = () => {
  const [noticiasPintura, setNoticiasPintura] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/pintura`);
        if (!response.ok) throw new Error("Error al cargar los datos");
        const data = await response.json();
        setNoticiasPintura(data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Carrusel de imágenes fijas para el banner
  const CarruselImagenesFijas = () => {
    const imagenes = [moto, moto1, moto2];
    const [indexActual, setIndexActual] = useState(0);
    const [fade, setFade] = useState(false);

    useEffect(() => {
      const intervalo = setInterval(() => {
        setFade(true);
        setTimeout(() => {
          setIndexActual((prev) => (prev + 1) % imagenes.length);
          setFade(false);
        }, 1000);
      }, 4000);
      return () => clearInterval(intervalo);
    }, [imagenes.length]);

    return (
      <img
        src={imagenes[indexActual]}
        alt={`Diseño ${indexActual + 1}`}
        className={`imagen-fija-pintura ${fade ? "oculto" : ""}`}
      />
    );
  };

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = noticiasPintura.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(noticiasPintura.length / itemsPerPage);

 

  return (
    <div id="main-container" className={!loading ? "fade-in-pintura" : ""}>
      <Layout />
      <div className="Contenido-Principal-Pintura">
        <div className="Informacion-Pintura">
          <Animacion texto="Diseños Motocicletas" className="Informacion-Pintura" />

          <div className="Informacion-RelevanteGeneral-Pintura">
            <section className="Imagen-Relevante-Pintura">
              <CarruselImagenesFijas />
            </section>

            <section className="InformacionRelevantePintura">
              <h2>Información Relevante</h2>
              <p>
                Aquí se visualizan los diseños realizados por nuestra compañía,
                incluyendo información sobre la marca y la motivación detrás de
                cada diseño.
              </p>
            </section>
          </div>
        </div>

        <div className="Container-Pintura">
          <div className="Contenedor-principal">
            {noticiasPintura.length > 0 ? (
              <>
                <ul className="grid-container-pintura">
                  {currentItems.map((noticia, index) => (
                    <ScrollAnimadoCrud
                      key={noticia.id_Noticias_Pintura || index}
                      delay={index * 0.2}
                    >
                      <li className="grid-item-pintura">
                        <CarruselImagenes
                          cover={noticia.cover}
                          nombre_Noticia_Pintura={noticia.nombre_Noticia_Pintura}
                          contenido_Noticia_Pintura={noticia.contenido_Noticia_Pintura}
                        />
                      </li>
                    </ScrollAnimadoCrud>
                  ))}
                </ul>

                {totalPages > 1 && (
                  <div className="pagina-control-pintura">
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
                )}
              </>
            ) : (
              <div className="no-results">
                <p>No se encontraron diseños disponibles.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

// Componente CarruselImagenes para mostrar las imágenes de cada diseño
const CarruselImagenes = ({
  cover,
  nombre_Noticia_Pintura,
  contenido_Noticia_Pintura,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState([]);

  useEffect(() => {
    try {
      const parsed = typeof cover === 'string' ? JSON.parse(cover) : cover;
      const urls = Array.isArray(parsed) 
        ? parsed.map(img => img?.url || img)
        : [];
      setImages(urls.filter(url => url));
    } catch {
      setImages(typeof cover === 'string' ? cover.split(',').map(c => c.trim()) : []);
    }
  }, [cover]);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div className="carrusel-container-pintura">
        <div className="imagen-contenedor-pintura">
          <img src={moto} alt="Imagen no disponible" className="imagen-fondo-pintura" />
        </div>
        <div className="texto-hover-pintura">
          <h2>{nombre_Noticia_Pintura}</h2>
          <p>{contenido_Noticia_Pintura}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="carrusel-container-pintura">
      <div className="imagen-contenedor-pintura">
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`${nombre_Noticia_Pintura} - imagen ${idx + 1}`}
            className={`imagen-fondo-pintura ${
              idx === currentImageIndex ? "visible" : "oculto"
            }`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = moto;
            }}
          />
        ))}
      </div>
      <div className="texto-hover-pintura">
        <h2>{nombre_Noticia_Pintura}</h2>
        <p>{contenido_Noticia_Pintura}</p>
      </div>
    </div>
  );
};

export default Pintura;