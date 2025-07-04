import React from "react";
import "./Index.css";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/573001112233"
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-fixed"
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        alt="WhatsApp"
        width="60"
        height="60"
      />
    </a>
  );
}
