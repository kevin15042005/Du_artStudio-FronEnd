import React, { useState, useEffect } from "react";
import Layout from "../../../Components/layout/index";
import Footer from "../../../Components/Footer/footer";
import Animacion from "../../../Components/Animacion/Animacion";
import PopUp from "../../../Components/popup/popup";
import "./Noticia.css";

export default function CrudNoticias() {
  const [noticia, setNoticia] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState([]);
  const [enlace, setEnlace] = useState("");
  const [noticiasPublicadas, setNoticiasPublicadas] = useState(0);
  const [subiendNoticia, setSubiendoNoticia] = useState(false);

  const [tituloActualizar, setTituloActualizar] = useState("");
  const [descripcionActualizar, setDescripcionActualizar] = useState("");
  const [imagenActualizar, setImagenActualizar] = useState([]);
  const [enlaceActualizar, setEnlaceActualizar] = useState("");
  const [idNoticiaActualizar, setIdNoticiaActualizar] = useState("");

  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [mostrarActualizar, setMostrarActualizar] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [expandedRows, setExpandedRows] = useState([]);

  const idAdministradorActual =
    localStorage.getItem("id_Administrador") || "1";

  const filtradoNoticia = Array.isArray(noticia)
    ? noticia.filter((item) =>
        item.nombre_Noticias?.toLowerCase().includes(busqueda.toLowerCase())
      )
    : [];

  const limpiarCampos = () => {
    setTitulo("");
    setDescripcion("");
    setImagen([]);
    setEnlace("");
    const input = document.getElementById("fileInput");
    if (input) input.value = "";
  };

  const limpiarCamposActualizar = () => {
    setTituloActualizar("");
    setDescripcionActualizar("");
    setImagenActualizar(null);
    setIdNoticiaActualizar("");
    setEnlaceActualizar("");
    const input = document.getElementById("fileInputActualizar");
    if (input) input.value = "";
  };

  const obtenerNoticias = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/noticias`);
      const data = await res.json();
      setNoticia(data);
      setNoticiasPublicadas(data.length);
    } catch (err) {
      console.error("Error al obtener las noticias:", err);
    }
  };

  useEffect(() => {
    obtenerNoticias();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (noticiasPublicadas >= 9) {
      alert("Ya llegaste al límite de 9 noticias publicadas.");
      return;
    }

    if (!titulo || !descripcion || imagen.length === 0) {
      alert("Ingresa todos los campos obligatorios");
      return;
    }

    if (!idAdministradorActual || idAdministradorActual === "null") {
      alert("Administrador no identificado.");
      return;
    }

    setSubiendoNoticia(true);

    const formData = new FormData();
    formData.append("nombre_Noticias", titulo);
    formData.append("contenido_Noticia", descripcion);
    formData.append("id_Administrador", idAdministradorActual);
    formData.append("enlace", enlace);
    imagen.forEach((img) => formData.append("cover", img));

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/noticias/crear`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      alert(data.message || "Noticia creada");
      limpiarCampos();
      obtenerNoticias();
      setMostrarCrear(false);
    } catch (err) {
      console.error(err);
      alert("Error al crear la noticia");
    } finally {
      setSubiendoNoticia(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!idNoticiaActualizar) {
      alert("No se ha seleccionado ninguna noticia para actualizar");
      return;
    }

    setSubiendoNoticia(true);
    try {
      const formData = new FormData();
      formData.append("nombre_Noticias", tituloActualizar);
      formData.append("contenido_Noticia", descripcionActualizar);
      formData.append("enlace", enlaceActualizar);
      if (imagenActualizar?.length > 0) {
        imagenActualizar.forEach((img) => {
          formData.append("cover", img);
        });
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/noticias/${idNoticiaActualizar}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al actualizar la noticia");
      }

      alert(data.message || "Noticia actualizada con éxito");
      limpiarCamposActualizar();
      setMostrarActualizar(false);
      obtenerNoticias();
    } catch (error) {
      console.error("Error al actualizar noticia:", error);
      alert(error.message || "Error al actualizar la noticia");
    } finally {
      setSubiendoNoticia(false);
    }
  };

  const handleDelete = async (id_Noticia) => {
    if (!window.confirm(`¿Estás seguro de eliminar la noticia ${id_Noticia}?`))
      return;
    setSubiendoNoticia(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/noticias/${id_Noticia}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al eliminar la noticia");
      }

      alert(data.message || "Noticia eliminada con éxito");
      obtenerNoticias();
    } catch (error) {
      console.error("Error al eliminar noticia:", error);
      alert(error.message || "Error al eliminar la noticia");
    } finally {
      setSubiendoNoticia(false);
    }
  };

  return (
    <>
      <div className="General-Noticia">
        <div className="Menu-Principal-Noticia">
          <Layout />
          <div className="Titulo-Noticia">
            <Animacion texto="Noticias Publicadas" />
          </div>

          <div className="NoticiaTabla">
            <div className="filtro-bar">
              <button onClick={() => setMostrarCrear(true)}>
                ➕ Crear Noticia
              </button>
              <input
                type="text"
                placeholder="Buscar Noticia"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            <div>
              <table className="tabla-noticias">
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
                  {filtradoNoticia.map((item) => (
                    <tr key={item.id_Noticia}>
                      <td>{item.id_Noticia}</td>
                      <td>{item.nombre_Noticias}</td>
                      <td>
                        <div className="descripcion-limitada">
                          {expandedRows.includes(item.id_Noticia)
                            ? item.contenido_Noticia
                            : item.contenido_Noticia.slice(0, 120) +
                              (item.contenido_Noticia.length > 120
                                ? "..."
                                : "")}
                          {item.enlace && (
                            <a
                              href={item.enlace}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="link-noticia"
                            >
                              🔗
                            </a>
                          )}
                        </div>
                      </td>
                      <td>{item.nombre_Administrador}</td>
                      <td>
                        <div className="acciones-botones">
                          <button
                            className="btn-editar"
                            onClick={() => {
                              setIdNoticiaActualizar(item.id_Noticia);
                              setTituloActualizar(item.nombre_Noticias);
                              setDescripcionActualizar(item.contenido_Noticia);
                              setEnlaceActualizar(item.enlace || "");
                              setMostrarActualizar(true);
                            }}
                          >
                            🖌️
                          </button>
                          <button
                            className="btn-eliminar"
                            onClick={() => handleDelete(item.id_Noticia)}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Crear */}
          {mostrarCrear && (
            <PopUp onClose={() => setMostrarCrear(false)} title="Crear Noticia">
              <form onSubmit={handleSubmit} className="popup-form">
                <input
                  type="text"
                  placeholder="Título"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  required
                />
                <textarea
                  placeholder="Descripción"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Enlace (opcional)"
                  value={enlace}
                  onChange={(e) => setEnlace(e.target.value)}
                />
                <input
                  type="file"
                  id="fileInput"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    setImagen(files);
                  }}
                  required
                />
                <button type="submit" disabled={subiendNoticia}>
                  {subiendNoticia ? "Cargando..." : "Crear"}
                </button>
              </form>
            </PopUp>
          )}

          {/* Actualizar */}
          {mostrarActualizar && (
            <PopUp
              onClose={() => {
                setMostrarActualizar(false);
                limpiarCamposActualizar();
              }}
              title="Actualizar Noticia"
            >
              <form onSubmit={handleUpdate} className="popup-form">
                <input
                  type="text"
                  placeholder="Título"
                  value={tituloActualizar}
                  onChange={(e) => setTituloActualizar(e.target.value)}
                />
                <textarea
                  placeholder="Descripción"
                  value={descripcionActualizar}
                  onChange={(e) => setDescripcionActualizar(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Enlace (opcional)"
                  value={enlaceActualizar}
                  onChange={(e) => setEnlaceActualizar(e.target.value)}
                />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  id="fileInputActualizar"
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    setImagenActualizar(files);
                  }}
                />
                <button type="submit" disabled={subiendNoticia}>
                  {subiendNoticia ? "Cargando..." : "Actualizar"}
                </button>
              </form>
            </PopUp>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
