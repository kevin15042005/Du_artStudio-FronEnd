import React, { useState, useEffect } from "react";
import axios from "axios";
import Footer from "../../../Components/Footer/footer";
import "./Registrar.css";
import Animacion from "../../../Components/Animacion/Animacion";
import PopUp from "../../../Components/popup/popup";
import Layout from "../../../Components/layout";

const Registrar = () => {
  const [registro, setRegistro] = useState([]);
  const [nombreCrear, setNombreCrear] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [pin_seguridad, setPin_seguridad] = useState("");

  const [nombreAdminActualizar, setNombreAdminActualizar] = useState("");
  const [correoAdminActualizar, setCorreoAdminActualizar] = useState("");
  const [pinAdminActualizar, setPinAdminActualizar] = useState("");
  const [idAdminActualizar, setIdAdminActualizar] = useState("");

  const [mostrarActualizar, setMostrarActualizar] = useState(false);
  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const filtrarRegistro = Array.isArray(registro)
    ? registro.filter((item) =>
        item.nombre_Administrador.toLowerCase().includes(busqueda.toLowerCase())
      )
    : [];

  const limpiarCampos = () => {
    setNombreCrear("");
    setCorreo("");
    setContrasena("");
    setPin_seguridad("");
    setCorreoAdminActualizar("");
    setPinAdminActualizar("");
  };

  const obtenerAdministradores = async () => {
    try {
      const res = await fetch("${import.meta.env.VITE_API_URL}/admin/");
      const data = await res.json();
      setRegistro(data);
    } catch (err) {
      console.error("Error al obtener administradores:", err);
    }
  };

  useEffect(() => {
    obtenerAdministradores();
  }, []);

  const handleRegistrar = async (e) => {
    e.preventDefault();
    if (contrasena.length < 8) {
      alert("Contraseña debe tener al menos 8 caracteres");
      return;
    }
    if (pin_seguridad.length !== 4) {
      alert("El PIN debe tener 4 caracteres");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/admin/register`, {
        nombre_Administrador: nombreCrear,
        correo_Administrador: correo,
        contraseña_Administrador: contrasena,
        pin_seguridad: pin_seguridad,
        rol_Administrador: "admin",
      });
      alert("✅ Registro exitoso");
      limpiarCampos();
      obtenerAdministradores();
      setMostrarCrear(false);
    } catch (err) {
      console.error("Error:", err);
      alert("❌ Ya existe este usuario/correo");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!correoAdminActualizar || !pinAdminActualizar || !contrasena) {
      alert("Completa todos los campos");
      return;
    }

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/admin/update`, {
        correo_Administrador: correoAdminActualizar,
        pin_seguridad: pinAdminActualizar,
        nuevaContraseña: contrasena,
      });

      alert("🔁 Contraseña actualizada correctamente");
      setMostrarActualizar(false);
      limpiarCampos();
      obtenerAdministradores();
    } catch (err) {
      alert("❌ Error al actualizar contraseña");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este administrador?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/admin/${id}`);
      alert("✅ Administrador eliminado");
      obtenerAdministradores();
    } catch (err) {
      alert("❌ Error al eliminar administrador");
    }
  };

  return (
    <div className="registrar-container">
      <Layout />
      <div className="contenido-registrar">
        <Animacion texto="Creación de Administrador" />
        <div className="filtradorRegistrar">
          <button onClick={() => setMostrarCrear(true)}>➕ Crear Administrador</button>
          <input
            type="text"
            placeholder="Buscar administrador"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <table className="tabla-registro">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrarRegistro.map((item) => (
              <tr key={item.id_Administrador}>
                <td>{item.id_Administrador}</td>
                <td>{item.nombre_Administrador}</td>
                <td>{item.rol_Administrador}</td>
                <td className="acciones-botones-shop">
                  <button
                    className="btn-editar"
                    onClick={() => {
                      setIdAdminActualizar(item.id_Administrador);
                      setNombreAdminActualizar(item.nombre_Administrador);
                      setCorreoAdminActualizar(item.correo_Administrador);
                      setMostrarActualizar(true);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-eliminar"
                    onClick={() => handleDelete(item.id_Administrador)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {mostrarCrear && (
          <PopUp onClose={() => setMostrarCrear(false)} title="Crear Administrador">
            <form onSubmit={handleRegistrar} className="popup-form">
              <input
                type="text"
                placeholder="Nombre"
                value={nombreCrear}
                onChange={(e) => setNombreCrear(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Correo"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
              <input
                type="text"
                maxLength={4}
                placeholder="PIN (4 dígitos)"
                value={pin_seguridad}
                onChange={(e) => setPin_seguridad(e.target.value)}
                required
              />
              <button type="submit">Registrar</button>
            </form>
          </PopUp>
        )}

        {mostrarActualizar && (
          <PopUp onClose={() => setMostrarActualizar(false)} title="Actualizar Contraseña">
            <form onSubmit={handleUpdate} className="popup-form">
              <input
                type="email"
                placeholder="Correo"
                value={correoAdminActualizar}
                onChange={(e) => setCorreoAdminActualizar(e.target.value)}
                required
              />
              <input
                type="text"
                maxLength={4}
                placeholder="PIN de seguridad"
                value={pinAdminActualizar}
                onChange={(e) => setPinAdminActualizar(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Nueva Contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
              <button type="submit">Actualizar</button>
            </form>
          </PopUp>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Registrar;
