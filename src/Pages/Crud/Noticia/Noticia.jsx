import React, { useState, useEffect } from "react";
import Layout from "../../../Components/layout/index";
import Footer from "../../../Components/Footer/footer";
import Animacion from "../../../Components/Animacion/Animacion";
import PopUp from "../../../Components/popup/popup";
import "./Pintura.css";

export default function CrudPintura() {
  const [noticias, setNoticias] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState([]);
  const [enlace, setEnlace] = useState("");
  const [subiendo, setSubiendo] = useState(false);

  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [mostrarActualizar, setMostrarActualizar] = useState(false);

  const [tituloAct, setTituloAct] = useState("");
  const [descripcionAct, setDescripcionAct] = useState("");
  const [imagenAct, setImagenAct] = useState([]);
  const [enlaceAct, setEnlaceAct] = useState("");
  const [idActualizar, setIdActualizar] = useState("");

  // Asegurar que haya un ID administrador
  const idAdministradorActual = localStorage.getItem("id_Administrador") || "1";

  const obtenerNoticias = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/pintura`);
      const data = await res.json();
      setNoticias(data);
    } catch (err) {
      console.error("❌ Error al obtener noticias:", err);
    }
  };

  useEffect(() => {
    obtenerNoticias();
  }, []);

  const limpiarCampos = () => {
    setTitulo("");
    setDescripcion("");
    setImagen([]);
    setEnlace("");
    const input = document.getElementById("fileInputPintura");
    if (input) input.value = "";
  };

  const limpiarActualizar = () => {
    setTituloAct("");
    setDescripcionAct("");
    setImagenAct([]);
    setEnlaceAct("");
    setIdActualizar("");
    const input = document.getElementById("fileInputActualizarPintura");
    if (input) input.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo || !descripcion || imagen.length === 0) {
      alert("Por favor completa todos los campos");
      return;
    }

    setSubiendo(true);
    const formData = new FormData();
    formData.append("nombre_Noticia_Pintura", titulo);
    formData.append("contenido_Noticia_Pintura", descripcion);
    formData.append("id_Administrador", idAdministradorActual);
    formData.append("enlace", enlace);
    imagen.forEach((img) => formData.append("cover", img));

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/pintura/crear`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      alert(data.message || "Noticia creada");
      limpiarCampos();
      obtenerNoticias();
      setMostrarCrear(false);
    } catch (err) {
      console.error("❌ Error al crear noticia:", err);
      alert("Error al crear noticia");
    } finally {
      setSubiendo(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!idActualizar) return;

    setSubiendo(true);
    const formData = new FormData();
    formData.append("nombre_Noticia_Pintura", tituloAct);
    formData.append("contenido_Noticia_Pintura", descripcionAct);
    formData.append("enlace", enlaceAct);
    imagenAct.forEach((img) => formData.append("cover", img));

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/pintura/${idActualizar}`, {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();
      alert(data.message || "Actualizado correctamente");
      limpiarActualizar();
      setMostrarActualizar(false);
      obtenerNoticias();
    } catch (err) {
      console.error("❌ Error al actualizar:", err);
      alert("Error al actualizar");
    } finally {
      setSubiendo(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta noticia?")) return;
    setSubiendo(true);
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/pintura/${id}`, {
        method: "DELETE",
      });
      alert("Eliminado correctamente");
      obtenerNoticias();
    } catch (err) {
      console.error("❌ Error al eliminar:", err);
      alert("Error al eliminar");
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <>
      <div className="General-Pintura">
        <Layout />
        <div className="Titulo-Pintura">
          <Animacion texto="Noticias de Pintura" />
        </div>

        <div className="PinturaTabla">
          <div className="filtro-bar">
            <button onClick={() => setMostrarCrear(true)}>➕ Crear</button>
          </div>

          <table className="tabla-pintura">
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Descripción</th>
                <th>Autor</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {noticias.map((n) => (
                <tr key={n.id_Noticias_Pintura}>
                  <td>{n.id_Noticias_Pintura}</td>
                  <td>{n.nombre_Noticia_Pintura}</td>
                  <td>{n.contenido_Noticia_Pintura}</td>
                  <td>{n.nombre_Administrador}</td>
                  <td>
                    <button
                      onClick={() => {
                        setIdActualizar(n.id_Noticias_Pintura);
                        setTituloAct(n.nombre_Noticia_Pintura);
                        setDescripcionAct(n.contenido_Noticia_Pintura);
                        setEnlaceAct(n.enlace || "");
                        setMostrarActualizar(true);
                      }}
                    >
                      🖌️
                    </button>
                    <button onClick={() => handleDelete(n.id_Noticias_Pintura)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Popup Crear */}
        {mostrarCrear && (
          <PopUp title="Crear Noticia" onClose={() => setMostrarCrear(false)}>
            <form onSubmit={handleSubmit} className="popup-form">
              <input
                type="text"
                placeholder="Título"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
              <textarea
                placeholder="Descripción"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
              <input
                type="text"
                placeholder="Enlace (opcional)"
                value={enlace}
                onChange={(e) => setEnlace(e.target.value)}
              />
              <input
                type="file"
                id="fileInputPintura"
                multiple
                onChange={(e) => setImagen(Array.from(e.target.files))}
              />
              <button type="submit" disabled={subiendo}>
                {subiendo ? "Cargando..." : "Crear"}
              </button>
            </form>
          </PopUp>
        )}

        {/* Popup Actualizar */}
        {mostrarActualizar && (
          <PopUp title="Actualizar Noticia" onClose={() => setMostrarActualizar(false)}>
            <form onSubmit={handleUpdate} className="popup-form">
              <input
                type="text"
                value={tituloAct}
                onChange={(e) => setTituloAct(e.target.value)}
              />
              <textarea
                value={descripcionAct}
                onChange={(e) => setDescripcionAct(e.target.value)}
              />
              <input
                type="text"
                placeholder="Enlace"
                value={enlaceAct}
                onChange={(e) => setEnlaceAct(e.target.value)}
              />
              <input
                type="file"
                id="fileInputActualizarPintura"
                multiple
                onChange={(e) => setImagenAct(Array.from(e.target.files))}
              />
              <button type="submit" disabled={subiendo}>
                {subiendo ? "Cargando..." : "Actualizar"}
              </button>
            </form>
          </PopUp>
        )}
      </div>
      <Footer />
    </>
  );
}
