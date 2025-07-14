import React, { useState, useEffect } from "react";
import axios from "axios";

function Slider() {
  const [aliados, setAliados] = useState([]);

  useEffect(() => {
    obtenerAliados();
  }, []);

  const obtenerAliados = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/aliados`)
      .then((res) => setAliados(res.data))
      .catch((err) => console.error("Error al cargar aliados", err));
  };

  const obtenerUrlImagen = (imagen) => {
    if (!imagen) return "";

    // Si es un string (posiblemente un JSON), intenta convertirlo
    if (typeof imagen === "string") {
      try {
        const obj = JSON.parse(imagen);
        return obj?.url || "";
      } catch (error) {
        console.warn("Error al parsear imagen_Marcas_Aliadas:", error);
        return "";
      }
    }

    // Si ya es un objeto, simplemente extrae la URL
    if (typeof imagen === "object" && imagen.url) {
      return imagen.url;
    }

    return "";
  };

  return (
    <div className="slider-container-aliados">
      <div className="slider">
        {[...aliados, ...aliados, ...aliados].map((aliado, index) => (
          <div key={index} className="aliado-card">
            <img
              src={obtenerUrlImagen(aliado.imagen_Marcas_Aliadas)}
              alt={`Aliado ${index}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Slider;
