import React, { useState } from "react";
import Layout from "../../Components/layout";
import Footer from "../../Components/Footer/footer";
import "./Contacto.css";
import Facebook from "../../assest-icons/facebook.png";
import Intagram from "../../assest-icons/instagram.png";
import TikTok from "../../assest-icons/tiktok.png";
import "./Contacto.css";
import fondocontacto from "../../assets/motos-fondo.jpg"
export default function Contacto() {
  const [result, setResult] = React.useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    
    const formData = new FormData(event.target);

    formData.append("access_key", "fba77929-2480-46cc-a1e3-c49c33d44006");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      setResult("Mensaje enviado");
      event.target.reset();
      setMensaje("")
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  };

  const [mensaje, setMensaje] = React.useState("");
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const maxPalabras = 45;
  const maxCaracteres = 45;

  const handleMensajeChange = (e) => {
    const texto = e.target.value;
    const palabras = texto.trim().split(/\s+/); // ← primero definimos las palabras

    // Verificar si hay alguna palabra demasiado larga
    const hayPalabraMuyLarga = palabras.some(
      (palabra) => palabra.length > maxCaracteres
    );

    if (hayPalabraMuyLarga) {
      if (!mostrarAlerta) {
        alert(`Cada palabra debe tener máximo ${maxCaracteres} caracteres.`);
        setMostrarAlerta(true);
      }
      return; 
    }

    if (palabras.length <= maxPalabras) {
      setMensaje(texto); 
      setMostrarAlerta(false); 
    } else if (!mostrarAlerta) {
      alert("Has alcanzado el límite de palabras.");
      setMostrarAlerta(true);
    }
  };

  return (
    <div id="main-container">
      <Layout />
      <main className="Informacion" >
         <div className="InformacionCorreo">
          <section className="contacto">
            <form onSubmit={onSubmit}>
              <h2>Tambien por Aqui</h2>
              <div className="input-box-contacto">
                <label>Telefono</label>
                <div className="telefono">
                  <button
                    className="telefono-button"
                    onClick={() => (window.location.href = "tel:+573204916831")}
                  >
                    +57 320 491 6831
                  </button>
                </div>
              </div>
              <div className="input-box-contacto">
                <label>Correo</label>
                <button
                  className="email-button"
                  onClick={() =>
                    (window.location.href = "mailto:kevinycami@yopmail.com")
                  }
                >
                  Enviar Correo
                </button>
              </div>
              <div className="input-box-contacto">
                <label>Redes</label>
                <div className="redes-sociales">
                  <a
                    href="https://www.facebook.com/share/1A3AwcNY3m/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src={Facebook} alt="Facebook" />
                  </a>
                  <a
                    href="https://www.instagram.com/du_artstudio?igsh=MTNwNXNubXE4dDlmeA=="
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src={Intagram} alt="Instagram" />
                  </a>
                  <a
                    href="https://www.tiktok.com/@du_artstudio?_t=ZS-8unFt2aarXL&_r=1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src={TikTok} alt="TikTok" />
                  </a>
                </div>
              </div>
              <button
                className="button-contacto-oir"
                type="button"
                onClick={() =>
                  window.open(
                    "https://wa.me/573204916831?text=" +
                      encodeURIComponent(
                        "¡Hola, espero que estés bien! Que look tienes pensado 😎?"
                      ),
                    "_blank"
                  )
                }
              >
                Estamos para oírte
              </button>{" "}
              <p>{result}</p> {/* Muestra el resultado del envío */}
            </form>
          </section>
        </div>
        <div className="InformacionCorreo">
          <section className="contacto">
            <form onSubmit={onSubmit}>
              <h2>Contactonos Aqui</h2>
              <div className="input-box-contacto">
                <label>Nombre Completo</label>
                <input
                  type="text"
                  className="field-contacto"
                  placeholder="Ingresar tu nombre"
                  name="nombre"
                  required
                />
              </div>
              <div className="input-box-contacto">
                <label>Direccion Email</label>
                <input
                  type="email"
                  className="field-contacto"
                  placeholder="Ingresar tu Email"
                  name="email"
                  required
                />
              </div>
              <div className="input-box-contacto">
                <label>Mensaje</label>
                <textarea
                  name="mensaje"
                  className="field-contacto mess"
                  placeholder="Escribe un mensaje "
                  required
                ></textarea>
              </div>
              <button className="Subir-mensaje" type="submit">Subir Mensaje</button>
              <p className="texto-resultado">{result}</p> {/* Muestra el resultado del envío */}
            </form>
          </section>
        </div>
       
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
