import React, { useState, useEffect } from "react";
import "./App.css";
import Layout from "./Components/layout";
import Footer from "./Components/Footer/footer";
import Slider from "./Components/Slider/Slider";
import moto from "./assets/cf1.jpeg";
import moto1 from "./assets/cf2.jpeg";
import moto2 from "./assets/cf3.jpeg";
import Animacion from "./Components/Animacion/Animacion";
import Loader from "./Components/Loader/Loader";

function CarruselImagenesFijas() {
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
      alt={`Imagen ${indexActual + 1}`}
      className={`imagen-fija ${fade ? "oculto" : ""}`}
    />
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

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
                Somos una compañia dedicada y apasionada a las motos donde veran
                todo lo relacionado a la pintura accesorios y diseño exclusivos
                de motos . Fabricacion de pintura de la mas alta calidad si
                quieres ver mas ... navega y descubre que tenemos para ti
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
