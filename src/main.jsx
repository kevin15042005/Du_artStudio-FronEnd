import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { CarritoProvider } from "./context/CarritoContext.jsx";
import Contacto from "./Pages/Contacto/Contacto.jsx";
import Pintura from "./Pages/Pintura/Pintura.jsx";
import Noticias from "./Pages/Noticias/Noticia.jsx";
import Loging from "./Pages/Login/Login.jsx";
import Nosotros from "./Pages/Nosotros/Nosotros.jsx";
import Compra from "./Pages/Compra/Shop.jsx";

import CrudNoticias from "./Pages/Crud/Noticia/Noticia.jsx";
import CrudNoticiasPintura from "./Pages/Crud/Pintura/Pintura.jsx";
import Shop from "./Pages/Crud/Shop/Shop.jsx";
import Registrar from "./Pages/Crud/Registrar/Registrar.jsx";
import Aliados from "./Pages/Crud/Aliados/Aliados.jsx";
import Inventario from "./Pages/Crud/Inventario/Inventario.jsx";
import Vehiculos from "./Pages/Crud/Vehiculos/Vehiculos.jsx";
// 🔐 Ruta protegida (admin)
import ProtectedRoute from "./Components/ProtectedRoute/index";
import { AuthProvider } from "./context/AuthContext.jsx";

// 👤 Zona de clientes: login + seguimiento del proceso de pintura.
import LoginCliente from "./Pages/Cliente/LoginCliente/LoginCliente.jsx";
import ProcesoPintura from "./Pages/Cliente/ProcesoPintura/ProcesoPintura.jsx";
import ProtectedRouteCliente from "./Components/ProtectedRoute/ProtectedRouteCliente.jsx";
import { ClienteAuthProvider } from "./context/ClienteAuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ClienteAuthProvider>
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

            {/* Zona de clientes */}
            <Route path="/ClienteLogin" element={<LoginCliente />} />
            <Route
              path="/MiProceso"
              element={
                <ProtectedRouteCliente>
                  <ProcesoPintura />
                </ProtectedRouteCliente>
              }
            />
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
            <Route
              path="/Inventario"
              element={
                <ProtectedRoute>
                  <Inventario />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Vehiculos"
              element={
                <ProtectedRoute>
                  <Vehiculos />
                </ProtectedRoute>
              }
            />
          </Routes>
        </CarritoProvider>
        </ClienteAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
