import React from "react";
import { useCarrito } from "../CarritoContext/CarritoContext";
import "./CarritoPopUp.css";
export default function CarritoPopup({ mostrar, cerrar }) {
  const { carrito, eliminarDelCarrito } = useCarrito();

  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + parseFloat(item.precio), 0);
  };

  const generarMensajeWhatsApp = () => {
    const mensaje = carrito
      .map((item, idx) => `${idx + 1}. ${item.nombre} - $${item.precio}`)
      .join("\n");

    const total = calcularTotal().toFixed(2);

    return encodeURIComponent(
      `Hola, quiero comprar:\n${mensaje}\n\nTotal: $${total}`
    );
  };

  if (!mostrar) return null;

  return (
    <div className="popup-carrito">
      <div className="popup-carrito-contenido">
        <button className="cerrar-popup" onClick={cerrar}>
          ✕
        </button>
        <h3>Carrito de Compras</h3>
        {carrito.length === 0 ? (
          <p>Tu carrito está vacío</p>
        ) : (
          <ul>
            {carrito.map((item, idx) => (
              <li key={idx} className="item-carrito">
                <span>{item.nombre}</span>
                <span>${item.precio}</span>
                <button onClick={() => eliminarDelCarrito(idx)}>
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
        {carrito.length > 0 && (
          <>
            <div className="total-carrito">
              <strong>Total:</strong> ${calcularTotal().toFixed(2)}
            </div>
            <a
              href={`https://wa.me/573202837622?text=${generarMensajeWhatsApp()}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="boton-whatsapp">Enviar mi pedido</button>
            </a>
          </>
        )}
      </div>
    </div>
  );
}
