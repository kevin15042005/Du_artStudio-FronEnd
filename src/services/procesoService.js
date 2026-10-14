// services/procesoService.js
//
// Cliente HTTP delgado contra el backend real (rutas /proceso y /cliente)
// para el paso a paso del proceso de pintura.

const API_URL = import.meta.env.VITE_API_URL;

async function manejarRespuesta(res) {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error en la solicitud");
  return data;
}

export async function obtenerPasos() {
  const res = await fetch(`${API_URL}/proceso/pasos`);
  return manejarRespuesta(res);
}

export async function obtenerModelos() {
  const res = await fetch(`${API_URL}/proceso/modelos`);
  return manejarRespuesta(res);
}

export async function obtenerVehiculosCliente(idCliente) {
  const res = await fetch(`${API_URL}/cliente/${idCliente}/vehiculos`);
  return manejarRespuesta(res);
}

export async function registrarVehiculo(idCliente, { id_Modelo, nombre_Modelo_Texto, placa, color }) {
  const res = await fetch(`${API_URL}/cliente/${idCliente}/vehiculos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_Modelo, nombre_Modelo_Texto, placa, color }),
  });
  return manejarRespuesta(res);
}
