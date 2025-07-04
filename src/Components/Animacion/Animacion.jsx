// Components/Animacion/Animacion.jsx
import React from "react";

const Animacion = React.memo(({ texto }) => {
  const letrasAnimadas = texto.split("").map((letra, index) => (
    <span
      key={`texto-${index}`}
      className="letra"
      style={{ animationDelay: `${index * 0.09}s` }}
    >
      {letra === " " ? "\u00A0" : letra}
    </span>
  ));

  return <h1 className="EstilosLetra">{letrasAnimadas}</h1>;
});

export default Animacion;
