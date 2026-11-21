import React, { useState, useEffect } from "react";
import "./App.css";
import Layout from "./Components/layout";
import Footer from "./Components/Footer/footer";
import Slider from "./Components/Slider/Slider";
import Animacion from "./Components/Animacion/Animacion";
import Loader from "./Components/Loader/Loader";

const CarruselImagenesFijas = () => {
  const imagenes = [
    "https://res.cloudinary.com/dismceqv1/image/upload/v1752259281/cf2_xtbvpw.jpg",
    "https://res.cloudinary.com/dismceqv1/image/upload/v1752259281/cf2_xtbvpw.jpg",
    "https://res.cloudinary.com/dismceqv1/image/upload/v1752259281/cf1_r4ubb9.jpg",
  ];

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
      onError={(e) => {
        e.currentTarget.src = "/default.jpg"; // Imagen de respaldo local si falla
      }}
    />
  );
};
function App() {
  const [, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      <div className="general">
        {" "}
        <Loader onLoadingComplete={handleLoadingComplete} />
        <Layout />
        <div className="General">
          <div className="BienvenidaApp">
            <div className="titulo-Inicio">
              <Animacion texto=" Bienvenido " />
            </div>
          </div>

          <div className="Informacion-RelevanteGeneral">
            <section className="InformacionRelevante">
              <h2>Información Relevante</h2>
              <p>
                Somos una compañía dedicada y apasionada por las motos, donde verás
                todo lo relacionado con pintura, accesorios y diseños exclusivos
                de motos. Fabricación de pintura de la más alta calidad. Si
                quieres ver más, navega y descubre lo que tenemos para ti.
              </p>
            </section>
            <section className="Imagen-Relevante-General">
              <CarruselImagenesFijas />
            </section>
          </div>

          <div className="Introduccion_Duart">
            <p>
              Disfruta de este agradable video donde veras lo que tenemos para
              ti
            </p>
            <div className="video-container">
              <iframe
                src="https://www.youtube.com/embed/XXFsHCSR4Cw?si=0MstQ_GNyGUm_U5u"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          <div className="MarcasAliadas">
            <h1>Nuestras Marcas Aliadas</h1>
          </div>

          <div className="slider-container">
            <div className="slider">
              <Slider />
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </>
  );
}

export default App;
