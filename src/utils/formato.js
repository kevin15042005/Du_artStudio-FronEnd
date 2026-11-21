// utils/formato.js

// 380000 -> "$380.000" (pesos colombianos, sin decimales)
export function formatoPesos(valor) {
  const numero = Number(valor);
  if (!Number.isFinite(numero)) return "";
  return `$${numero.toLocaleString("es-CO", { maximumFractionDigits: 0 })}`;
}
