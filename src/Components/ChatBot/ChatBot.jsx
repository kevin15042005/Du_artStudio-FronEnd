// Components/ChatBot/ChatBot.jsx
import React, { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { RESPUESTAS_RAPIDAS, buscarRespuesta } from "./chatbotRespuestas.js";
import { preguntarAsistente } from "../../services/asistenteService.js";
import { useClienteAuth } from "../../context/ClienteAuthContext.jsx";
import "./ChatBot.css";

const MENSAJE_BIENVENIDA = {
  autor: "bot",
  texto: "¡Hola! Soy el asistente de Du'Art Studio 🎨🏍️. ¿En qué te puedo ayudar?",
};

export default function ChatBot() {
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState([MENSAJE_BIENVENIDA]);
  const [texto, setTexto] = useState("");
  const [pensando, setPensando] = useState(false);
  const finRef = useRef(null);
  const { clienteActual } = useClienteAuth();

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes, abierto, pensando]);

  // Preguntas rápidas: respuesta inmediata con las reglas por palabras clave
  const enviarPreguntaRapida = (contenido) => {
    const mensajeUsuario = { autor: "usuario", texto: contenido };
    const respuestaBot = { autor: "bot", texto: buscarRespuesta(contenido) };
    setMensajes((prev) => [...prev, mensajeUsuario, respuestaBot]);
  };

  // Texto libre: responde la IA; si no está disponible, se usan las reglas
  const enviarPreguntaLibre = async (contenido) => {
    setMensajes((prev) => [...prev, { autor: "usuario", texto: contenido }]);
    setPensando(true);
    let respuesta;
    try {
      respuesta = await preguntarAsistente(contenido, clienteActual?.id_Cliente);
    } catch (err) {
      console.error("Asistente con IA no disponible:", err);
      respuesta = buscarRespuesta(contenido);
    } finally {
      setPensando(false);
    }
    setMensajes((prev) => [...prev, { autor: "bot", texto: respuesta }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!texto.trim() || pensando) return;
    enviarPreguntaLibre(texto.trim());
    setTexto("");
  };

  return (
    <div className="chatbot-wrapper">
      {abierto && (
        <div className="chatbot-ventana">
          <div className="chatbot-header">
            <span>Asistente Du'Art</span>
            <button onClick={() => setAbierto(false)} aria-label="Cerrar chat">
              <X size={20} />
            </button>
          </div>

          <div className="chatbot-mensajes">
            {mensajes.map((m, i) => (
              <div key={i} className={`chatbot-burbuja chatbot-burbuja--${m.autor}`}>
                {m.texto}
              </div>
            ))}
            {pensando && (
              <div className="chatbot-burbuja chatbot-burbuja--bot chatbot-burbuja--pensando">
                Escribiendo…
              </div>
            )}
            <div ref={finRef} />
          </div>

          <div className="chatbot-preguntas-rapidas">
            {RESPUESTAS_RAPIDAS.slice(0, 4).map((r) => (
              <button key={r.id} onClick={() => enviarPreguntaRapida(r.pregunta)} disabled={pensando}>
                {r.pregunta}
              </button>
            ))}
          </div>

          <form className="chatbot-input-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Escribe tu pregunta..."
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              maxLength={500}
            />
            <button type="submit" aria-label="Enviar" disabled={pensando}>
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      <button
        className="chatbot-burbuja-flotante"
        onClick={() => setAbierto((v) => !v)}
        aria-label="Abrir chat"
      >
        {abierto ? <X size={26} /> : <MessageCircle size={26} />}
      </button>
    </div>
  );
}
