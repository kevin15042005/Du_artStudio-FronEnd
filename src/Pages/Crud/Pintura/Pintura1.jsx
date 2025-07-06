import React, { useEffect, useState } from "react";
import Layout from "../../../Components/layout";
import Animacion from "../../../Components/Animacion/Animacion";
import PopUp from "../../../Components/popup/popup";
import Footer from "../../../Components/Footer/footer";
import "./Pintura.css";
import imagenFallback from "../../../assets/cf1.jpeg";

export default function CrudNoticiasPintura() {
  // Estados principales
  const [pintura, setPintura] = useState([]);
  
  // Estados para creación
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    imagenes: []
  });
  
  // Estados para edición
  const [editData, setEditData] = useState({
    id: "",
    titulo: "",
    descripcion: "",
    imagenes: null
  });
  
  // Estados para UI
  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [mostrarActualizar, setMostrarActualizar] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const noticiasPorPagina = 9;

  // Obtener noticias
  const obtenerNoticias = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/pintura`);
      if (!res.ok) throw new Error("Error al cargar noticias");
      const data = await res.json();
      setPintura(data);
    } catch (err) {
      console.error("Error al obtener noticias:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar noticias al montar
  useEffect(() => {
    obtenerNoticias();
  }, []);

  // Filtrar noticias para búsqueda
  const noticiasFiltradas = pintura.filter(noticia =>
    noticia.nombre_Noticia_Pintura?.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Paginación
  const indexUltima = paginaActual * noticiasPorPagina;
  const indexPrimera = indexUltima - noticiasPorPagina;
  const noticiasActuales = noticiasFiltradas.slice(indexPrimera, indexUltima);
  const totalPaginas = Math.ceil(noticiasFiltradas.length / noticiasPorPagina);

  // Crear nueva noticia
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.titulo || !formData.descripcion || formData.imagenes.length === 0) {
      alert("Todos los campos son obligatorios");
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nombre_Noticia_Pintura", formData.titulo);
      formDataToSend.append("contenido_Noticia_Pintura", formData.descripcion);
      formData.imagenes.forEach(img => formDataToSend.append("cover", img));

      const res = await fetch(`${import.meta.env.VITE_API_URL}/pintura/crear`, {
        method: "POST",
        body: formDataToSend,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al crear noticia");

      alert("✅ Noticia creada correctamente");
      setFormData({ titulo: "", descripcion: "", imagenes: [] });
      setMostrarCrear(false);
      obtenerNoticias();
    } catch (err) {
      console.error("Error:", err);
      alert(err.message || "Error al crear la noticia");
    } finally {
      setLoading(false);
    }
  };

  // Actualizar noticia
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editData.id) return;

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nombre_Noticia_Pintura", editData.titulo);
      formDataToSend.append("contenido_Noticia_Pintura", editData.descripcion);
      
      if (editData.imagenes) {
        if (Array.isArray(editData.imagenes)) {
          editData.imagenes.forEach(img => formDataToSend.append("cover", img));
        } else {
          formDataToSend.append("cover", editData.imagenes);
        }
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/pintura/${editData.id}`,
        { method: "PUT", body: formDataToSend }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al actualizar");

      alert("✅ Noticia actualizada correctamente");
      setEditData({ id: "", titulo: "", descripcion: "", imagenes: null });
      setMostrarActualizar(false);
      obtenerNoticias();
    } catch (err) {
      console.error("Error:", err);
      alert(err.message || "Error al actualizar la noticia");
    } finally {
      setLoading(false);
    }
  };

  // Eliminar noticia
  const handleDelete = async (id) => {
    if (!window.confirm(`¿Estás seguro de eliminar el diseño ${id}?`)) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/pintura/${id}`,
        { method: "DELETE" }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error al eliminar");

      alert("✅ Diseño eliminado con éxito");
      obtenerNoticias();
    } catch (error) {
      console.error("Error al eliminar noticia:", error);
      alert(error.message || "Error al eliminar la noticia");
    } finally {
      setLoading(false);
    }
  };

  // Preparar edición
  const prepararEdicion = (noticia) => {
    setEditData({
      id: noticia.id_Noticias_Pintura,
      titulo: noticia.nombre_Noticia_Pintura,
      descripcion: noticia.contenido_Noticia_Pintura,
      imagenes: null
    });
    setMostrarActualizar(true);
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
            <button 
              onClick={() => setMostrarCrear(true)}
              disabled={loading}
            >
              ➕ Crear Noticia
            </button>
            <input
              type="text"
              placeholder="Buscar Diseño"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              disabled={loading}
            />
          </div>

          <table className="tabla-Diseño">
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
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
                    <CarruselImagenes 
                      cover={item.cover} 
                      nombre_Noticia_Pintura={item.nombre_Noticia_Pintura} 
                    />
                  </td>
                  <td>
                    <button
                      className="btn-editar-pintura"
                      onClick={() => prepararEdicion(item)}
                      disabled={loading}
                    >
                      🖌️
                    </button>
                    <button
                      className="btn-eliminar-pintura"
                      onClick={() => handleDelete(item.id_Noticias_Pintura)}
                      disabled={loading}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPaginas > 1 && (
            <div className="paginacion">
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  className={paginaActual === num ? "activo" : ""}
                  onClick={() => setPaginaActual(num)}
                  disabled={loading}
                >
                  {num}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Modal para crear noticia */}
        {mostrarCrear && (
          <PopUp 
            onClose={() => {
              setMostrarCrear(false);
              setFormData({ titulo: "", descripcion: "", imagenes: [] });
            }} 
            title="Crear Noticia"
          >
            <form onSubmit={handleSubmit} className="popup-form">
              <input
                type="text"
                placeholder="Título"
                value={formData.titulo}
                onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                required
                disabled={loading}
              />
              <textarea
                placeholder="Descripción"
                value={formData.descripcion}
                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                required
                disabled={loading}
              />
              <input
                type="file"
                multiple
                onChange={(e) => setFormData({
                  ...formData, 
                  imagenes: Array.from(e.target.files)
                })}
                required
                disabled={loading}
              />
              <button type="submit" disabled={loading}>
                {loading ? "Creando..." : "Crear"}
              </button>
            </form>
          </PopUp>
        )}

        {/* Modal para actualizar noticia */}
        {mostrarActualizar && (
          <PopUp 
            onClose={() => {
              setMostrarActualizar(false);
              setEditData({ id: "", titulo: "", descripcion: "", imagenes: null });
            }} 
            title="Actualizar Noticia"
          >
            <form onSubmit={handleUpdate} className="popup-form">
              <input
                type="text"
                placeholder="Título"
                value={editData.titulo}
                onChange={(e) => setEditData({...editData, titulo: e.target.value})}
                required
                disabled={loading}
              />
              <textarea
                placeholder="Descripción"
                value={editData.descripcion}
                onChange={(e) => setEditData({...editData, descripcion: e.target.value})}
                required
                disabled={loading}
              />
              <input
                type="file"
                multiple
                onChange={(e) => setEditData({
                  ...editData, 
                  imagenes: Array.from(e.target.files)
                })}
                disabled={loading}
              />
              <p className="file-hint">Dejar vacío para conservar imágenes actuales</p>
              <button type="submit" disabled={loading}>
                {loading ? "Actualizando..." : "Actualizar"}
              </button>
            </form>
          </PopUp>
        )}
      </div>
      <Footer />
    </>
  );
}

// Componente CarruselImagenes para mostrar las imágenes
function CarruselImagenes({ cover, nombre_Noticia_Pintura }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState([]);

  useEffect(() => {
    try {
      const parsed = typeof cover === 'string' ? JSON.parse(cover) : cover;
      const urls = Array.isArray(parsed) 
        ? parsed.map(img => img?.url || img)
        : [];
      setImages(urls.filter(url => url));
    } catch {
      setImages(typeof cover === 'string' ? cover.split(',').map(c => c.trim()) : []);
    }
  }, [cover]);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div className="imagen-contenedor-pintura">
        <img src={imagenFallback} alt="No disponible" className="imagen-fondo-pintura" />
      </div>
    );
  }

  return (
    <div className="imagen-contenedor-pintura">
      {images.map((img, i) => (
        <img
          key={i}
          src={img}
          alt={`${nombre_Noticia_Pintura} ${i + 1}`}
          className={`imagen-fondo-pintura ${i === currentImageIndex ? "visible" : "oculto"}`}
          onError={(e) => { 
            e.target.onerror = null;
            e.target.src = imagenFallback;
          }}
        />
      ))}
    </div>
  );
}