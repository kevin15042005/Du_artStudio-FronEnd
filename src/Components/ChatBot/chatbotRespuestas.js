// Components/ChatBot/chatbotRespuestas.js
//
// "Cerebro" del chatbot, sin IA: reglas simples por palabras clave.

export const RESPUESTAS_RAPIDAS = [
  {
    id: "servicios",
    pregunta: "¿Qué servicios ofrecen?",
    palabrasClave: ["servicio", "servicios", "que hacen", "qué hacen", "ofrecen", "pintura", "pintan"],
    respuesta:
      "En Du'Art Studio nos especializamos en pintura y personalización de motos: alistamiento, lijado, preparación de pintura, detallado y pulido. También trabajamos accesorios y diseños exclusivos.",
  },
  {
    id: "proceso",
    pregunta: "¿Cómo veo el proceso de mi moto?",
    palabrasClave: ["proceso", "seguimiento", "estado", "mi moto", "en que va", "en qué va"],
    respuesta:
      "Puedes crear tu cuenta de cliente en 'Mi Proceso' (arriba en el menú), registrar tu moto y ver en tiempo real en qué paso va: alistamiento, lijado, preparación, detallado o pulido.",
  },
  {
    id: "cotizar",
    pregunta: "¿Cómo cotizo un trabajo?",
    palabrasClave: ["cotiza", "cotizar", "precio", "precios", "costo", "cuanto cuesta", "cuánto cuesta", "valor"],
    respuesta:
      "Los precios dependen del trabajo y la moto. Escríbenos por WhatsApp (el botón flotante 💬) contándonos qué necesitas y te damos una cotización.",
  },
  {
    id: "contacto",
    pregunta: "¿Cómo los contacto?",
    palabrasClave: ["contacto", "whatsapp", "telefono", "teléfono", "llamar", "escribir"],
    respuesta:
      "Puedes escribirnos directamente por WhatsApp con el botón 💬 en la esquina de la pantalla, o desde la página de Contacto.",
  },
  {
    id: "ubicacion",
    pregunta: "¿Dónde están ubicados?",
    palabrasClave: ["ubicacion", "ubicación", "direccion", "dirección", "donde quedan", "dónde quedan", "taller"],
    respuesta:
      "Puedes ver nuestra ubicación exacta en la sección 'Ubicación' del menú principal.",
  },
  {
    id: "cuenta",
    pregunta: "¿Cómo creo una cuenta?",
    palabrasClave: ["cuenta", "registrar", "registro", "usuario", "contraseña", "login", "crear cuenta"],
    respuesta:
      "Entra a 'Mi Proceso' en el menú, elige 'Crear una' en el formulario de ingreso, y completa tus datos. Con esa cuenta podrás registrar tu moto y ver su proceso cuando quieras.",
  },
];

const RESPUESTA_DEFECTO =
  "No estoy seguro de esa pregunta 🤔. Puedes intentar con otras palabras, o escribirnos directo por WhatsApp (botón 💬) y con gusto te ayudamos.";

export function buscarRespuesta(mensaje) {
  const texto = mensaje.toLowerCase();

  const encontrada = RESPUESTAS_RAPIDAS.find((item) =>
    item.palabrasClave.some((palabra) => texto.includes(palabra))
  );

  return encontrada ? encontrada.respuesta : RESPUESTA_DEFECTO;
}
