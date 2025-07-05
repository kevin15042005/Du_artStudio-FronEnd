import React, { useEffect, useState } from "react";
import Layout from "../../../Components/layout";
import Animacion from "../../../Components/Animacion/Animacion";
import PopUp from "../../../Components/popup/popup";
import Footer from "../../../Components/Footer/footer";
import "./Pintura.css";
import imagenFallback from "../../../assets/cf1.jpeg"; // imagen de respaldo

export default function CrudNoticiasPintura() {
  const [pintura, setPintura] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState([]);
  const [noticiasPinturaPublicadas, setNoticiasPinturaPublicadas] = useState(0);

  const [tituloActualizar, setTituloActualizar] = useState("");
  const [descripcionActualizar, setDescripcionActualizar] = useState("");
  const [imagenActualizar, setImagenActualizar] = useState(null);
  const [idNoticiaActualizar, setIdNoticiaActualizar] = useState("");

  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [mostrarActualizar, setMostrarActualizar] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const noticiasPorPagina = 9;

  const filtradoNoticiaPintura = Array.isArray(pintura)
    ? pintura.filter((item) =>
        item.nombre_Noticia_Pintura
          ?.toLowerCase()
          .includes(busqueda.toLowerCase())
      )
    : [];

  const indexUltima = paginaActual * noticiasPorPagina;
  const indexPrimera = indexUltima - noticiasPorPagina;
  const noticiasActuales = filtradoNoticiaPintura.slice(
    indexPrimera,
    indexUltima
  );
  const totalPaginas = Math.ceil(
    filtradoNoticiaPintura.length / noticiasPorPagina
  );

  const cambiarPagina = (numero) => setPaginaActual(numero);

  const limpiarCampos = () => {
    setTitulo("");
    setDescripcion("");
    setImagen([]);
    const input = document.getElementById("fileInput");
    if (input) input.value = "";
  };

  const limpiarCamposActualizar = () => {
    setTituloActualizar("");
    setDescripcionActualizar("");
    setImagenActualizar(null);
    setIdNoticiaActualizar("");
    const input = document.getElementById("fileInputActualizar");
    if (input) input.value = "";
  };

  const obtenerNoticias = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/pintura`);
      const data = await res.json();
      setPintura(data);
      setNoticiasPinturaPublicadas(data.length);
    } catch (err) {
      console.error("Error al obtener noticias", err);
    }
  };

  useEffect(() => {
    obtenerNoticias();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titulo || !descripcion || imagen.length === 0) {
      alert("Ingrese todos los campos");
      return;
    }

    const formData = new FormData();
    formData.append("nombre_Noticia_Pintura", titulo);
    formData.append("contenido_Noticia_Pintura", descripcion);
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
    } catch (err) {
      console.error(err);
      alert("Error al crear la noticia");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!idNoticiaActualizar) {
      alert("No se ha seleccionado ninguna noticia para actualizar");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("id_Noticias_Pintura", idNoticiaActualizar);
      formData.append("nombre_Noticia_Pintura", tituloActualizar);
      formData.append("contenido_Noticia_Pintura", descripcionActualizar);
      if (imagenActualizar) {
        formData.append("cover", imagenActualizar);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/pintura`,
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
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`¿Estás seguro de eliminar el diseño ${id}?`)) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/pintura/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al eliminar la noticia");
      }

      alert(data.message || "Diseño eliminado con éxito");
      obtenerNoticias();
    } catch (error) {
      console.error("Error al eliminar noticia:", error);
      alert(error.message || "Error al eliminar la noticia");
    }
  };

  return (
    <>
      <div className="menu-Pricipal-Pintura">
        <Layout />

        <div className="Titulo-Noticia">
          <Animacion texto="Diseños Publicados" />
        </div>

        <div className="DiseñoTabla">
          <div className="filtradoDiseños">
            <button onClick={() => setMostrarCrear(true)}>➕ Crear Noticia</button>
            <input
              type="text"
              placeholder="Buscar Diseño"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <table className="tabla-Diseño">
            <thead>
              <tr>
                <th>ID</th>
                <th>Titulo</th>
                <th>Descripción</th>
                <th>Imágenes</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {noticiasActuales.map((item) => (
                <tr key={item.id_Noticias_Pintura}>
                  <td>{item.id_Noticias_Pintura}</td>
                  <td>{item.nombre_Noticia_Pintura}</td>
                  <td>{item.contenido_Noticia_Pintura.slice(0, 80)}...</td>
                  <td style={{ maxWidth: "200px" }}>
                    <CarruselImagenes cover={item.cover} nombre_Noticia_Pintura={item.nombre_Noticia_Pintura} />
                  </td>
                  <td>
                    <button
                      className="btn-editar-pintura"
                      onClick={() => {
                        setIdNoticiaActualizar(item.id_Noticias_Pintura);
                        setTituloActualizar(item.nombre_Noticia_Pintura);
                        setDescripcionActualizar(item.contenido_Noticia_Pintura);
                        setMostrarActualizar(true);
                      }}
                    >
                      🖌️
                    </button>
                    <button
                      className="btn-eliminar-pintura"
                      onClick={() => handleDelete(item.id_Noticias_Pintura)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="paginacion">
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                className={paginaActual === num ? "activo" : ""}
                onClick={() => cambiarPagina(num)}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Crear Noticia */}
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
                type="file"
                id="fileInput"
                multiple
                onChange={(e) => setImagen(Array.from(e.target.files))}
                required
              />
              <button type="submit">Crear</button>
            </form>
          </PopUp>
        )}

        {/* Actualizar Noticia */}
        {mostrarActualizar && (
          <PopUp onClose={() => { setMostrarActualizar(false); limpiarCamposActualizar(); }} title="Actualizar Noticia">
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
                type="file"
                id="fileInputActualizar"
                onChange={(e) => setImagenActualizar(e.target.files[0])}
              />
              <button type="submit">Actualizar</button>
            </form>
          </PopUp>
        )}
      </div>

      <Footer />
    </>
  );
}

// ✅ Carrusel interno incluido
function CarruselImagenes({ cover, nombre_Noticia_Pintura }) {
  const [indexActual, setIndexActual] = useState(0);
  const [images, setImages] = useState([]);

  useEffect(() => {
    try {
      const parsed = JSON.parse(cover || "[]");
      const urls = Array.isArray(parsed)
        ? parsed.map((img) => img.url || img)
        : [];
      setImages(urls);
    } catch {
      setImages((cover || "").split(",").map((c) => c.trim()));
    }
  }, [cover]);

  useEffect(() => {
    if (images.length === 0) return;
    const interval = setInterval(() => {
      setIndexActual((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images]);

  if (!images.length) {
    return <img src={imagenFallback} alt="No disponible" className="imagen-fondo-pintura" />;
  }

  return (
    <div className="imagen-contenedor-pintura">
      {images.map((img, i) => (
        <img
          key={i}
          src={img}
          alt={`${nombre_Noticia_Pintura} ${i + 1}`}
          className={`imagen-fondo-pintura ${i === indexActual ? "visible" : "oculto"}`}
          onError={(e) => { e.target.src = imagenFallback; }}
        />
      ))}
    </div>
  );
}
