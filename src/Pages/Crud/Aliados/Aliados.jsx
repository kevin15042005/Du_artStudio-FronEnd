import React, { useState, useEffect } from "react";
import Layout from "../../../Components/layout";
import Footer from "../../../Components/Footer/footer";
import PopUp from "../../../Components/popup/popup";
import Animacion from "../../../Components/Animacion/Animacion";
import "./Aliados.css";

function Aliados() {
  const [nombre, setNombre] = useState("");
  const [imagen, setImagen] = useState(null);
  const [aliados, setAliados] = useState([]);
  const [preview, setPreview] = useState(null);

  const [idActualizar, setIdActualizar] = useState("");
  const [nombreActualizar, setNombreActualizar] = useState("");
  const [imagenActualizar, setImagenActualizar] = useState(null);
  const [previewActualizar, setPreviewActualizar] = useState(null);

  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [mostrarActualizar, setMostrarActualizar] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const VITE_API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    obtenerAliados();
  }, []);

  const obtenerAliados = async () => {
    try {
      const res = await fetch(`${VITE_API_URL}/api/aliados`);
      const data = await res.json();
      setAliados(data);
    } catch (err) {
      console.error("Error al cargar aliados", err);
    }
  };

  const filtrarAliados = aliados.filter((aliado) =>
    aliado.nombre_Marcas_Aliadas.toLowerCase().includes(busqueda.toLowerCase())
  );

  const obtenerUrlImagen = (imagenString) => {
    try {
      const imagenObj = JSON.parse(imagenString);
      return imagenObj.url || "";
    } catch (error) {
      console.warn("Error al parsear imagen:", error);
      return "";
    }
  };

  const limpiarCampos = () => {
    setNombre("");
    setImagen(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre || !imagen) {
      alert("Ingrese los dos campos");
      return;
    }

    const formData = new FormData();
    formData.append("nombre_Marcas_Aliadas", nombre);
    formData.append("cover", imagen);

    try {
      const res = await fetch(`${VITE_API_URL}/api/aliados`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      alert(data.message || "Aliado creado");
      limpiarCampos();
      setMostrarCrear(false);
      obtenerAliados();
    } catch (error) {
      console.error("Error al crear el aliado:", error);
      alert("Error al crear el aliado");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!idActualizar) {
      alert("ID del aliado requerido");
      return;
    }

    const formData = new FormData();
    if (nombreActualizar) formData.append("nombre_Marcas_Aliadas", nombreActualizar);
    if (imagenActualizar) formData.append("cover", imagenActualizar);

    if (!nombreActualizar && !imagenActualizar) {
      alert("Debe cambiar al menos el nombre o la imagen");
      return;
    }

    try {
      const res = await fetch(`${VITE_API_URL}/api/aliados/${idActualizar}`, {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();
      alert(data.message || "Aliado actualizado");
      setIdActualizar("");
      setNombreActualizar("");
      setImagenActualizar(null);
      setPreviewActualizar(null);
      setMostrarActualizar(false);
      obtenerAliados();
    } catch (err) {
      console.error("Error al actualizar aliado", err);
      alert("Error al actualizar aliado");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este aliado?")) return;

    try {
      const res = await fetch(`${VITE_API_URL}/api/aliados/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      alert(data.message || "Aliado eliminado correctamente");
      obtenerAliados();
    } catch (err) {
      console.error("Error al eliminar aliado", err);
      alert("Error al eliminar aliado");
    }
  };

  return (
    <>
      <div className="Pagina-Principal">
        <Layout />
        <Animacion texto="Aliados" />

        <div className="AliadosTabla">
          <div className="filtradoAliado" style={{ marginBottom: "1rem" }}>
            <button onClick={() => setMostrarCrear(true)}>➕ Crear Aliado</button>
            <input
              type="text"
              placeholder="Buscar aliado..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <table className="tabla-aliados">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrarAliados.map((aliado) => (
                <tr key={aliado.id_Marcas_Aliadas}>
                  <td>{aliado.id_Marcas_Aliadas}</td>
                  <td>{aliado.nombre_Marcas_Aliadas}</td>
                  <td>
                    <button
                      onClick={() => {
                        setIdActualizar(aliado.id_Marcas_Aliadas);
                        setNombreActualizar(aliado.nombre_Marcas_Aliadas);
                        setMostrarActualizar(true);
                      }}
                    >
                      🖌️
                    </button>
                    <button
                      onClick={() => handleDelete(aliado.id_Marcas_Aliadas)}
                      style={{ marginLeft: "8px" }}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="AliadosLista">
          <Animacion texto="Aliados Registrados" />
          <div className="slider-container-aliados">
            <div className="slider">
              {[...aliados, ...aliados].map((aliado, index) => (
                <div key={index} className="aliado-card">
                  <img
                    src={obtenerUrlImagen(aliado.imagen_Marcas_Aliadas)}
                    alt={aliado.nombre_Marcas_Aliadas}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {mostrarCrear && (
        <PopUp onClose={() => setMostrarCrear(false)} title="Crear Aliado">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre del aliado"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setImagen(file);
                setPreview(URL.createObjectURL(file));
              }}
            />
            {preview && <img src={preview} alt="Vista previa" style={{ maxWidth: "200px" }} />}
            <button type="submit">Crear</button>
          </form>
        </PopUp>
      )}

      {mostrarActualizar && (
        <PopUp onClose={() => setMostrarActualizar(false)} title="Actualizar Aliado">
          <form onSubmit={handleUpdate}>
            <input
              type="text"
              placeholder="Nuevo nombre"
              value={nombreActualizar}
              onChange={(e) => setNombreActualizar(e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setImagenActualizar(file);
                setPreviewActualizar(URL.createObjectURL(file));
              }}
            />
            {previewActualizar && (
              <img src={previewActualizar} alt="Preview" style={{ maxWidth: "200px" }} />
            )}
            <button type="submit">Actualizar</button>
          </form>
        </PopUp>
      )}
      <Footer />
    </>
  );
}

export default Aliados;
