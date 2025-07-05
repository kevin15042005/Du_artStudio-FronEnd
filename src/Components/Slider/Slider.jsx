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

  return (
    <div className="slider-container-aliados">
      <div className="slider">
        {[...aliados, ...aliados, ...aliados].map((aliado, index) => {
          let imagenUrl = "";
          try {
            const imgData = JSON.parse(aliado.imagen_Marcas_Aliadas);
            imagenUrl = imgData.url;
          } catch (e) {
            console.error("Imagen no válida:", aliado.imagen_Marcas_Aliadas);
          }

          return (
            <div key={index} className="aliado-card">
              <img src={imagenUrl} alt={`Aliado ${index}`} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Slider;
