import React, { useEffect, useState } from "react";
import Layout from "../../Components/layout";
import Footer from "../../Components/Footer/footer";
import Animacion from "../../Components/Animacion/Animacion";
import PopUp from "../../Components/popup/popup";
import "./CrudNoticiasPintura.css";

export default function CrudNoticiasPintura() {
  const [noticias, setNoticias] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagenes, setImagenes] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const [idActualizar, setIdActualizar] = useState(null);
  const [tituloActualizar, setTituloActualizar] = useState("");
  const [descripcionActualizar, setDescripcionActualizar] = useState("");
  const [imagenesActualizar, setImagenesActualizar] = useState([]);

  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [mostrarActualizar, setMostrarActualizar] = useState(false);

  const obtenerNoticias = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/pintura`);
      const data = await res.json();
      setNoticias(data);
    } catch (err) {
      console.error("Error al obtener noticias:", err);
    }
  };

  useEffect(() => {
    obtenerNoticias();
  }, []);

  const handleCrear = async (e) => {
    e.preventDefault();
    if (!titulo || !descripcion || imagenes.length === 0) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    const formData = new FormData();
    formData.append("nombre_Noticia_Pintura", titulo);
    formData.append("contenido_Noticia_Pintura", descripcion);
    imagenes.forEach((img) => formData.append("cover", img));

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/pintura/crear`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      alert(data.message || "Noticia creada");
      setMostrarCrear(false);
      obtenerNoticias();
    } catch (error) {
      alert("Error al crear noticia");
    }
  };

  const handleActualizar = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("id_Noticias_Pintura", idActualizar);
    formData.append("nombre_Noticia_Pintura", tituloActualizar);
    formData.append("contenido_Noticia_Pintura", descripcionActualizar);
    if (imagenesActualizar.length > 0) {
      imagenesActualizar.forEach((img) => formData.append("cover", img));
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/pintura`, {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();
      alert(data.message || "Noticia actualizada");
      setMostrarActualizar(false);
      obtenerNoticias();
    } catch (err) {
      alert("Error al actualizar noticia");
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Deseas eliminar esta noticia?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/pintura/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      alert(data.message || "Noticia eliminada");
      obtenerNoticias();
    } catch (err) {
      alert("Error al eliminar noticia");
    }
  };

  const filtradas = noticias.filter((n) =>
    n.nombre_Noticia_Pintura.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <>
      <Layout />
      <div className="crud-noticias-pintura">
        <Animacion texto="Gestión de Diseños" />
        <div className="barra-filtro">
          <button onClick={() => setMostrarCrear(true)}>➕ Crear</button>
          <input
            type="text"
            placeholder="Buscar diseño"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <table className="tabla-crud">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtradas.map((n) => (
              <tr key={n.id_Noticias_Pintura}>
                <td>{n.id_Noticias_Pintura}</td>
                <td>{n.nombre_Noticia_Pintura}</td>
                <td>{n.contenido_Noticia_Pintura.slice(0, 100)}...</td>
                <td>
                  <button
                    onClick={() => {
                      setIdActualizar(n.id_Noticias_Pintura);
                      setTituloActualizar(n.nombre_Noticia_Pintura);
                      setDescripcionActualizar(n.contenido_Noticia_Pintura);
                      setMostrarActualizar(true);
                    }}
                  >
                    🖌️
                  </button>
                  <button onClick={() => handleEliminar(n.id_Noticias_Pintura)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />

      {mostrarCrear && (
        <PopUp title="Crear Diseño" onClose={() => setMostrarCrear(false)}>
          <form onSubmit={handleCrear} className="popup-form">
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Título"
              required
            />
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción"
              required
            />
            <input
              type="file"
              multiple
              onChange={(e) => setImagenes(Array.from(e.target.files))}
              required
            />
            <button type="submit">Crear</button>
          </form>
        </PopUp>
      )}

      {mostrarActualizar && (
        <PopUp title="Actualizar Diseño" onClose={() => setMostrarActualizar(false)}>
          <form onSubmit={handleActualizar} className="popup-form">
            <input
              type="text"
              value={tituloActualizar}
              onChange={(e) => setTituloActualizar(e.target.value)}
              placeholder="Título"
              required
            />
            <textarea
              value={descripcionActualizar}
              onChange={(e) => setDescripcionActualizar(e.target.value)}
              placeholder="Descripción"
              required
            />
            <input
              type="file"
              multiple
              onChange={(e) => setImagenesActualizar(Array.from(e.target.files))}
            />
            <button type="submit">Actualizar</button>
          </form>
        </PopUp>
      )}
    </>
  );
}
