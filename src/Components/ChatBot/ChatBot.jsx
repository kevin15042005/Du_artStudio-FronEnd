// Components/ChatBot/ChatBot.jsx
import React, { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { RESPUESTAS_RAPIDAS, buscarRespuesta } from "./chatbotRespuestas.js";
import "./ChatBot.css";

const MENSAJE_BIENVENIDA = {
  autor: "bot",
  texto: "¡Hola! Soy el asistente de Du'Art Studio 🎨🏍️. ¿En qué te puedo ayudar?",
};

export default function ChatBot() {
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState([MENSAJE_BIENVENIDA]);
  const [texto, setTexto] = useState("");
  const finRef = useRef(null);

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes, abierto]);

  const enviarMensaje = (contenido) => {
    const mensajeUsuario = { autor: "usuario", texto: contenido };
    const respuestaBot = { autor: "bot", texto: buscarRespuesta(contenido) };
    setMensajes((prev) => [...prev, mensajeUsuario, respuestaBot]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!texto.trim()) return;
    enviarMensaje(texto.trim());
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
            <div ref={finRef} />
          </div>

          <div className="chatbot-preguntas-rapidas">
            {RESPUESTAS_RAPIDAS.slice(0, 4).map((r) => (
              <button key={r.id} onClick={() => enviarMensaje(r.pregunta)}>
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
            />
            <button type="submit" aria-label="Enviar">
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
