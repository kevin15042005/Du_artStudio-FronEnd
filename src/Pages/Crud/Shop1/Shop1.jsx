import React, { useEffect, useState } from "react";
import Layout from "../../Components/layout";
import Footer from "../../Components/Footer/footer";
import PopUp from "../../Components/popup/popup";
import "./Shop1.css";
import Animacion from "../../Components/Animacion/Animacion";

export default function Shop1() {
  const [shop, setShop] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const articulosPorPagina = 9;

  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [mostrarActualizar, setMostrarActualizar] = useState(false);
  const [subiendo, setSubiendo] = useState(false);

  const [formulario, setFormulario] = useState({
    id_Shop: "",
    nombre_Shop: "",
    contenido_Shop: "",
    precio_Shop: "",
    cover: [],
  });

  useEffect(() => {
    obtenerArticulos();
  }, []);

  const obtenerArticulos = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/Shop`);
      const data = await res.json();
      setShop(data);
    } catch (err) {
      console.error("Error al obtener artículos", err);
    }
  };

  const limpiarFormulario = () => {
    setFormulario({
      id_Shop: "",
      nombre_Shop: "",
      contenido_Shop: "",
      precio_Shop: "",
      cover: [],
    });
    const input = document.getElementById("fileInput");
    if (input) input.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nombre_Shop, contenido_Shop, precio_Shop, cover } = formulario;
    if (!nombre_Shop || !contenido_Shop || !precio_Shop || cover.length === 0) {
      alert("Complete todos los campos");
      return;
    }

    const formData = new FormData();
    formData.append("nombre_Shop", nombre_Shop);
    formData.append("contenido_Shop", contenido_Shop);
    formData.append("precio_Shop", precio_Shop);
    cover.forEach((img) => formData.append("cover", img));

    setSubiendo(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/Shop/crear`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      alert(data.message || "Artículo creado");
      limpiarFormulario();
      obtenerArticulos();
      setMostrarCrear(false);
    } catch (err) {
      console.error(err);
      alert("Error al crear el artículo");
    } finally {
      setSubiendo(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { id_Shop, nombre_Shop, contenido_Shop, precio_Shop, cover } = formulario;
    if (!id_Shop) return;

    const formData = new FormData();
    formData.append("id_Shop", id_Shop);
    formData.append("nombre_Shop", nombre_Shop);
    formData.append("contenido_Shop", contenido_Shop);
    formData.append("precio_Shop", precio_Shop);
    if (cover.length > 0) {
      cover.forEach((img) => formData.append("cover", img));
    }

    setSubiendo(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/Shop`, {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();
      alert(data.message || "Artículo actualizado");
      limpiarFormulario();
      obtenerArticulos();
      setMostrarActualizar(false);
    } catch (err) {
      console.error(err);
      alert("Error al actualizar");
    } finally {
      setSubiendo(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este artículo?")) return;
    setSubiendo(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/Shop/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      alert(data.message || "Artículo eliminado");
      obtenerArticulos();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar");
    } finally {
      setSubiendo(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormulario((prev) => ({
      ...prev,
      cover: Array.from(e.target.files),
    }));
  };

  const handleEditar = (item) => {
    setFormulario({
      id_Shop: item.id_Shop,
      nombre_Shop: item.nombre_Shop,
      contenido_Shop: item.contenido_Shop,
      precio_Shop: item.precio_Shop,
      cover: [],
    });
    setMostrarActualizar(true);
  };

  const filtrados = shop.filter((item) =>
    item.nombre_Shop?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const totalPaginas = Math.ceil(filtrados.length / articulosPorPagina);
  const indexUltimo = paginaActual * articulosPorPagina;
  const indexPrimero = indexUltimo - articulosPorPagina;
  const shopPaginados = filtrados.slice(indexPrimero, indexUltimo);

  return (
    <div className="Menu-Principal-Shop">
      <Layout />
      <div className="Titulo-Shop">
        <Animacion texto="Administrar Artículos" />
      </div>

      <div className="Tabla-Articulos">
        <div className="filtradorShop">
          <button onClick={() => setMostrarCrear(true)}>➕ Crear Artículo</button>
          <input
            type="text"
            placeholder="Buscar Artículo"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <table className="tabla-articulos">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {shopPaginados.map((item) => (
              <tr key={item.id_Shop}>
                <td>{item.id_Shop}</td>
                <td>{item.nombre_Shop}</td>
                <td>{item.contenido_Shop}</td>
                <td>${item.precio_Shop}</td>
                <td>
                  <button onClick={() => handleEditar(item)}>🖌️</button>
                  <button onClick={() => handleDelete(item.id_Shop)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="paginacion">
          {Array.from({ length: totalPaginas }, (_, i) => (
            <button
              key={i}
              className={paginaActual === i + 1 ? "activo" : ""}
              onClick={() => setPaginaActual(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Popup Crear */}
      {mostrarCrear && (
        <PopUp title="Crear Artículo" onClose={() => setMostrarCrear(false)}>
          <form onSubmit={handleSubmit} className="popup-form">
            <input
              name="nombre_Shop"
              placeholder="Título"
              value={formulario.nombre_Shop}
              onChange={handleInputChange}
            />
            <textarea
              name="contenido_Shop"
              placeholder="Descripción"
              value={formulario.contenido_Shop}
              onChange={handleInputChange}
            />
            <input
              name="precio_Shop"
              placeholder="Precio"
              value={formulario.precio_Shop}
              onChange={handleInputChange}
            />
            <input
              type="file"
              id="fileInput"
              multiple
              onChange={handleFileChange}
            />
            <button type="submit" disabled={subiendo}>
              {subiendo ? "Cargando..." : "Crear"}
            </button>
          </form>
        </PopUp>
      )}

      {/* Popup Actualizar */}
      {mostrarActualizar && (
        <PopUp
          title="Actualizar Artículo"
          onClose={() => {
            setMostrarActualizar(false);
            limpiarFormulario();
          }}
        >
          <form onSubmit={handleUpdate} className="popup-form">
            <input
              name="nombre_Shop"
              placeholder="Título"
              value={formulario.nombre_Shop}
              onChange={handleInputChange}
            />
            <textarea
              name="contenido_Shop"
              placeholder="Descripción"
              value={formulario.contenido_Shop}
              onChange={handleInputChange}
            />
            <input
              name="precio_Shop"
              placeholder="Precio"
              value={formulario.precio_Shop}
              onChange={handleInputChange}
            />
            <input
              type="file"
              id="fileInput"
              multiple
              onChange={handleFileChange}
            />
            <button type="submit" disabled={subiendo}>
              {subiendo ? "Actualizando..." : "Actualizar"}
            </button>
          </form>
        </PopUp>
      )}

      <Footer />
    </div>
  );
}
