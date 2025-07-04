// Shop1.jsx (Frontend React)
import React, { useEffect, useState } from "react";
import Layout from "../../Components/layout";
import Footer from "../../Components/Footer/footer";
import "./Shop.css";
import ScrollAnimadoCrud from "../../Components/ScrollAnimationCrud/index";
import { useCarrito } from "../../Components/CarritoContext/CarritoContext";
import Animacion  from "../../Components/Animacion/Animacion";


function CarruselImagenes({ cover, nombre_Shop, contenido_Shop }) {
  const images = cover ? cover.split(",") : [];
  const [indexActual, setIndexActual] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndexActual((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(intervalo);
  }, [images.length]);

  if (images.length === 0) return null;

  return (
    <div className="carrusel-container-Compra">
      <div className="imagen-contenedor-Compra">
        {images.map((img, idx) => (
          <img
            key={idx}
            src={`${import.meta.env.VITE_API_URL}/uploads/${img}`}
            alt={`${nombre_Shop} - imagen ${idx + 1}`}
            className={`imagen-fondo-Compra ${
              idx === indexActual ? "visible" : "oculto"
            }`}
          />
        ))}
      </div>
      <div className="texto-hover-Compra">
        <h2>{nombre_Shop}</h2>
        <p>{contenido_Shop}</p>
      </div>
    </div>
  );
}

export default function Shop1() {
  const [shop, setShop] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const { agregarAlCarrito } = useCarrito();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/Shop`)
      .then((res) => res.json())
      .then((data) => setShop(data))
      .catch((err) => console.log(err));
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = shop.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(shop.length / itemsPerPage);

  return (
    <>
      <div id="main-container">
        <Layout />
        <div className="Contenido-Compra">
          <div className="Informacion-Compra">
              <Animacion texto="Venta Articulos"  className="titulo-Compra"/>
            <div className="Informacion-RelevanteGeneral-Compra">
              <section className="InformacionRelevanteCompra">
                <h2>Diseños a la venta</h2>
                <p>
                  En esta sección verás los artículos disponibles, qué tipo de
                  moto se usó como inspiración y detalles del diseño.
                </p>
              </section>
            </div>
          </div>

          <div className="Container-Compra">
            <div className="Contenedor-Compra">
              <ul className="grid-container-Compra">
                {currentItems.map((articulo, index) => (
                  <ScrollAnimadoCrud key={articulo.id_Shop} delay={index * 0.2}>
                    <li className="grid-item-Compra">
                      <CarruselImagenes
                        cover={articulo.cover}
                        nombre_Shop={articulo.nombre_Shop}
                        contenido_Shop={articulo.contenido_Shop}
                      />
                      <div className="contenedor-precio">
                        <span className="precio">${articulo.precio_Shop}</span>
                        <button
                          className="boton-comprar"
                          onClick={() =>
                            agregarAlCarrito({
                              nombre: articulo.nombre_Shop,
                              precio: articulo.precio_Shop,
                            })
                          }
                        >
                          Comprar
                        </button>
                      </div>
                    </li>
                  </ScrollAnimadoCrud>
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
        </div>
        <footer>
          <Footer />
        </footer>
      </div>
    </>
  );
}
