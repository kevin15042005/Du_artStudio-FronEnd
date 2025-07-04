import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { CarritoProvider } from "./Components/CarritoContext/CarritoContext.jsx";
import Contacto from "./Pages/Contacto/Contacto.jsx";
import Pintura from "./Pages/Pintura/Pintura.jsx";
import Noticias from "./Pages/Noticias/Noticia.jsx";
import Loging from "./Pages/Loging/Login.jsx";
import Nosotros from "./Pages/Nosotros/Nosotros.jsx";
import Compra from "./Pages/Compra/Shop.jsx";

import CrudNoticias from "./Pages/Crud/Noticia/Noticia.jsx";
import CrudNoticiasPintura from "./Pages/Crud/Pintura/Pintura1.jsx";
import Shop from "./Pages/Crud/Shop1/Shop1.jsx";
import Registrar from "./Pages/Crud/Registrar/Registrar.jsx";
import Aliados from "./Pages/Crud/Aliados/Aliados.jsx";
// 🔐 Ruta protegida
import ProtectedRoute from "./Components/ProtectedRoute/index";
import { AuthProvider } from "./Components/AuthContext/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CarritoProvider>
          <Routes>
            {/* Rutas públicas */}
            <Route index path="/" element={<App />} />
            <Route path="/Pintura" element={<Pintura />} />
            <Route path="/Contacto" element={<Contacto />} />
            <Route path="/Noticias" element={<Noticias />} />
            <Route path="/Loging" element={<Loging />} />
            <Route path="/Nosotros" element={<Nosotros />} />
            <Route path="/Compra" element={<Compra />} />
            {/* Rutas protegidas (solo si está logueado) */}
            <Route
              path="/CrudNoticias"
              element={
                <ProtectedRoute>
                  <CrudNoticias />
                </ProtectedRoute>
              }
            />
            <Route
              path="/CrudNoticiasPintura"
              element={
                <ProtectedRoute>
                  <CrudNoticiasPintura />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Shop"
              element={
                <ProtectedRoute>
                  <Shop />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Registrar"
              element={
                <ProtectedRoute>
                  <Registrar />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Aliados"
              element={
                <ProtectedRoute>
                  <Aliados />
                </ProtectedRoute>
              }
            />
          </Routes>
        </CarritoProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
