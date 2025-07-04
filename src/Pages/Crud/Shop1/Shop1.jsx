import React, { useEffect, useState } from "react";
import Layout from "../../../Components/layout";
import Animacion from "../../../Components/Animacion/Animacion";
import Footer from "../../../Components/Footer/footer";
import PopUp from "../../../Components/popup/popup";
import "./Shop1.css";

export default function Shop() {
  const [ventas, setVentas] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState([]);
  const [id_Shop, setIdShop] = useState("");
  const [precio_Shop, setPrecio_Shop] = useState("");

  const [tituloActualizar, setTituloActualizar] = useState("");
  const [descripcionActualizar, setDescripcionActualizar] = useState("");
  const [imagenActualizar, setImagenActualizar] = useState(null);
  const [id_ShopActualizar, setIdShopActualizar] = useState("");
  const [precio_ShopActualizar, setPrecio_ShopActualizar] = useState("");

  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [mostrarActualizar, setMostrarActualizar] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const articulosPorPagina = 9;

  const filtradoVentas = Array.isArray(ventas)
    ? ventas.filter((item) =>
        item.nombre_Shop?.toLowerCase().includes(busqueda.toLowerCase())
      )
    : [];
  const indexUltima = paginaActual * articulosPorPagina;
  const indexPrimera = indexUltima - articulosPorPagina;
  const ventasPaginadas = filtradoVentas.slice(indexPrimera, indexUltima);
  const totalPaginas = Math.ceil(filtradoVentas.length / articulosPorPagina);

  const limpiarCampos = () => {
    setTitulo("");
    setDescripcion("");
    setImagen([]);
    setIdShop("");
    setPrecio_Shop("");
    const input = document.getElementById("fileInput");
    if (input) input.value = "";
  };

  const limpiarCamposActualizar = () => {
    setTituloActualizar("");
    setDescripcionActualizar("");
    setImagenActualizar(null);
    setIdShopActualizar("");
    setPrecio_ShopActualizar("");
    const input = document.getElementById("fileInputActualizar");
    if (input) input.value = "";
  };

  const obtenerNoticias = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/Shop`);
      const data = await res.json();
      setVentas(data);
    } catch (err) {
      console.error("Error al obtener la noticia", err);
    }
  };

  useEffect(() => {
    obtenerNoticias();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo || !descripcion || !precio_Shop || imagen.length === 0) {
      alert("Ingrese todos los campos");
      return;
    }

    const formData = new FormData();
    formData.append("nombre_Shop", titulo);
    formData.append("contenido_Shop", descripcion);
    formData.append("precio_Shop", precio_Shop);
    imagen.forEach((img) => formData.append("cover", img));

    try {
      const res = await fetch("${import.meta.env.VITE_API_URL}/Shop/crear", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      alert(data.message || "Artículo creado");
      limpiarCampos();
      obtenerNoticias();
    } catch (err) {
      console.error(err);
      alert("Error al crear el artículo");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!id_ShopActualizar) return alert("ID no válido");

    const formData = new FormData();
    formData.append("id_Shop", id_ShopActualizar);
    formData.append("nombre_Shop", tituloActualizar);
    formData.append("contenido_Shop", descripcionActualizar);
    formData.append("precio_Shop", precio_ShopActualizar);
    if (imagenActualizar) formData.append("cover", imagenActualizar);

    try {
      const res = await fetch("${import.meta.env.VITE_API_URL}/Shop", {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Error al actualizar artículo");
      alert(data.message || "Artículo actualizado");
      limpiarCamposActualizar();
      obtenerNoticias();
      setMostrarActualizar(false);
    } catch (err) {
      console.error(err);
      alert(err.message || "Error al actualizar artículo");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`¿Eliminar el artículo ${id}?`)) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/Shop/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al eliminar artículo");
      alert(data.message || "Artículo eliminado exitosamente");
      obtenerNoticias();
    } catch (err) {
      console.error(err);
      alert(err.message || "Error al eliminar artículo");
    }
  };

  return (
    <>
      <div className="Menu-Principal-Shop">
        <Layout />
        <div className="Titulo-Shop">
          <Animacion texto="Artículos Publicados" />
        </div>
        <div className="Tabla-Articulos">
          <div className="filtradorShop">
            <button onClick={() => setMostrarCrear(true)}>
              ➕ Crear Artículo
            </button>
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
              {ventasPaginadas.map((item) => (
                <tr key={item.id_Shop}>
                  <td>{item.id_Shop}</td>
                  <td>{item.nombre_Shop}</td>
                  <td>{item.contenido_Shop}</td>
                  <td>{item.precio_Shop}</td>
                  <td>
                    <div className="acciones-botones-shop">
                      <button
                        className="btn-editar"
                        onClick={() => {
                          setIdShopActualizar(item.id_Shop);
                          setTituloActualizar(item.nombre_Shop);
                          setDescripcionActualizar(item.contenido_Shop);
                          setPrecio_ShopActualizar(item.precio_Shop);
                          setMostrarActualizar(true);
                        }}
                      >
                        🖌️
                      </button>
                      <button
                        className="btn-eliminar"
                        onClick={() => handleDelete(item.id_Shop)}
                      >
                        🗑️
                      </button>
                    </div>
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
        {/* POPUP CREAR */}
        {mostrarCrear && (
          <PopUp onClose={() => setMostrarCrear(false)} title="Crear Artículo">
            <form onSubmit={handleSubmit} className="popup-form">
              <input
                type="text"
                placeholder="Título"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
              <input
                type="text"
                placeholder="Descripción"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
              <input
                type="text"
                placeholder="Costo"
                value={precio_Shop}
                onChange={(e) => setPrecio_Shop(e.target.value)}
              />
              <input
                type="file"
                id="fileInput"
                multiple
                onChange={(e) => setImagen(Array.from(e.target.files))}
              />
              <button type="submit">Crear</button>
            </form>
          </PopUp>
        )}
        {/* POPUP ACTUALIZAR */}
        {mostrarActualizar && (
          <PopUp
            onClose={() => {
              setMostrarActualizar(false);
              limpiarCamposActualizar();
            }}
            title="Actualizar Artículo"
          >
            <form onSubmit={handleUpdate} className="popup-form">
              <input
                type="text"
                placeholder="Título"
                value={tituloActualizar}
                onChange={(e) => setTituloActualizar(e.target.value)}
              />
              <input
                type="text"
                placeholder="Descripción"
                value={descripcionActualizar}
                onChange={(e) => setDescripcionActualizar(e.target.value)}
              />
              <input
                type="file"
                id="fileInputActualizar"
                onChange={(e) => setImagenActualizar(e.target.files[0])}
              />
              <input
                type="text"
                placeholder="Costo"
                value={precio_ShopActualizar}
                onChange={(e) => setPrecio_ShopActualizar(e.target.value)}
              />
              <input type="hidden" value={id_ShopActualizar} readOnly />
              <button type="submit">Actualizar</button>
            </form>
          </PopUp>
        )}{" "}
      </div>
      <div>
        {" "}
        <Footer />
      </div>
    </>
  );
}
