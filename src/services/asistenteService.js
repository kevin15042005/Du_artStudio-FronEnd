// services/asistenteService.js
//
// Pregunta al asistente con IA del backend (ruta /asistente, que usa OpenCode).

const API_URL = import.meta.env.VITE_API_URL;

export async function preguntarAsistente(pregunta, idCliente) {
  const res = await fetch(`${API_URL}/asistente`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pregunta, id_Cliente: idCliente || null }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "El asistente no está disponible");
  return data.respuesta;
}
