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
        {[...aliados, ...aliados, ...aliados].map((aliado, index) => (
          <div key={index} className="aliado-card">
            <img
              src={`${import.meta.env.VITE_API_URL}/uploads/${aliado.imagen_Marcas_Aliadas}`}
              alt={`Aliado ${index + 1}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Slider;
