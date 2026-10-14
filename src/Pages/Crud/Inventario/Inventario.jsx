import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../../Components/layout";
import Footer from "../../../Components/Footer/footer";
import Animacion from "../../../Components/Animacion/Animacion";
import PopUp from "../../../Components/popup/popup";
import "./Inventario.css";

const API = import.meta.env.VITE_API_URL;

export default function Inventario() {
  const [tab, setTab] = useState("productos");

  const [productos, setProductos] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);

  const [modeloPlantilla, setModeloPlantilla] = useState("");
  const [pasos, setPasos] = useState([]);
  const [plantilla, setPlantilla] = useState([]);

  const [mostrarCrearProducto, setMostrarCrearProducto] = useState(false);
  const [nombreProducto, setNombreProducto] = useState("");
  const [unidadProducto, setUnidadProducto] = useState("unidad");

  const [mostrarCrearModelo, setMostrarCrearModelo] = useState(false);
  const [nombreModelo, setNombreModelo] = useState("");

  const [mostrarAgregarPlantilla, setMostrarAgregarPlantilla] = useState(false);
  const [productoPlantilla, setProductoPlantilla] = useState("");
  const [pasoPlantilla, setPasoPlantilla] = useState("");
  const [cantidadPlantilla, setCantidadPlantilla] = useState(1);

  const cargarProductos = async () => {
    const res = await axios.get(`${API}/inventario/productos`);
    setProductos(res.data);
  };

  const cargarModelos = async () => {
    const res = await axios.get(`${API}/proceso/modelos`);
    setModelos(res.data);
  };

  const cargarPasos = async () => {
    const res = await axios.get(`${API}/proceso/pasos`);
    setPasos(res.data);
  };

  const cargarSolicitudes = async () => {
    const res = await axios.get(`${API}/inventario/solicitudes`);
    setSolicitudes(res.data);
  };

  const cargarPlantilla = async (idModelo) => {
    if (!idModelo) {
      setPlantilla([]);
      return;
    }
    const res = await axios.get(`${API}/inventario/plantilla/${idModelo}`);
    setPlantilla(res.data);
  };

  useEffect(() => {
    cargarProductos();
    cargarModelos();
    cargarPasos();
    cargarSolicitudes();
  }, []);

  useEffect(() => {
    cargarPlantilla(modeloPlantilla);
  }, [modeloPlantilla]);

  const handleCrearProducto = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/inventario/productos`, {
        nombre_Producto: nombreProducto,
        unidad_medida: unidadProducto,
      });
      setNombreProducto("");
      setUnidadProducto("unidad");
      setMostrarCrearProducto(false);
      cargarProductos();
    } catch {
      alert("❌ Error al crear producto");
    }
  };

  const handleEliminarProducto = async (id) => {
    if (!window.confirm("¿Eliminar este producto?")) return;
    await axios.delete(`${API}/inventario/productos/${id}`);
    cargarProductos();
  };

  const handleCrearModelo = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/proceso/modelos`, { nombre_Modelo: nombreModelo });
      setNombreModelo("");
      setMostrarCrearModelo(false);
      cargarModelos();
    } catch (err) {
      alert(err.response?.data?.message || "❌ Error al crear modelo");
    }
  };

  const handleEliminarModelo = async (id) => {
    if (!window.confirm("¿Eliminar este modelo?")) return;
    await axios.delete(`${API}/proceso/modelos/${id}`);
    cargarModelos();
    if (String(id) === String(modeloPlantilla)) setModeloPlantilla("");
  };

  const handleAgregarPlantilla = async (e) => {
    e.preventDefault();
    if (!modeloPlantilla || !productoPlantilla) {
      alert("Selecciona un modelo y un producto");
      return;
    }
    try {
      await axios.post(`${API}/inventario/plantilla`, {
        id_Modelo: modeloPlantilla,
        id_Paso: pasoPlantilla || null,
        id_Producto: productoPlantilla,
        cantidad_Recomendada: cantidadPlantilla,
      });
      setProductoPlantilla("");
      setPasoPlantilla("");
      setCantidadPlantilla(1);
      setMostrarAgregarPlantilla(false);
      cargarPlantilla(modeloPlantilla);
    } catch {
      alert("❌ Error al agregar a la plantilla");
    }
  };

  const handleEliminarPlantilla = async (id) => {
    await axios.delete(`${API}/inventario/plantilla/${id}`);
    cargarPlantilla(modeloPlantilla);
  };

  const handleMarcarEntregada = async (id) => {
    await axios.put(`${API}/inventario/solicitudes/${id}`, { estado: "entregada" });
    cargarSolicitudes();
  };

  return (
    <div className="inventario-container">
      <Layout />
      <div className="contenido-inventario">
        <Animacion texto="Inventario y Solicitudes" />

        <div className="inventario-tabs">
          {[
            ["productos", "Productos"],
            ["modelos", "Modelos"],
            ["plantillas", "Plantillas"],
            ["solicitudes", "Solicitudes"],
          ].map(([key, label]) => (
            <button
              key={key}
              className={`inventario-tab ${tab === key ? "activo" : ""}`}
              onClick={() => setTab(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "productos" && (
          <section>
            <div className="inventario-toolbar">
              <button onClick={() => setMostrarCrearProducto(true)}>➕ Nuevo Producto</button>
            </div>
            <table className="tabla-registro">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Unidad</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p) => (
                  <tr key={p.id_Producto}>
                    <td>{p.id_Producto}</td>
                    <td>{p.nombre_Producto}</td>
                    <td>{p.unidad_medida}</td>
                    <td className="acciones-botones-shop">
                      <button className="btn-eliminar" onClick={() => handleEliminarProducto(p.id_Producto)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {tab === "modelos" && (
          <section>
            <div className="inventario-toolbar">
              <button onClick={() => setMostrarCrearModelo(true)}>➕ Nuevo Modelo</button>
            </div>
            <table className="tabla-registro">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Modelo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {modelos.map((m) => (
                  <tr key={m.id_Modelo}>
                    <td>{m.id_Modelo}</td>
                    <td>{m.nombre_Modelo}</td>
                    <td className="acciones-botones-shop">
                      <button className="btn-eliminar" onClick={() => handleEliminarModelo(m.id_Modelo)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {tab === "plantillas" && (
          <section>
            <div className="inventario-toolbar">
              <label className="inventario-select-modelo">
                Modelo:
                <select value={modeloPlantilla} onChange={(e) => setModeloPlantilla(e.target.value)}>
                  <option value="">-- Selecciona un modelo --</option>
                  {modelos.map((m) => (
                    <option key={m.id_Modelo} value={m.id_Modelo}>
                      {m.nombre_Modelo}
                    </option>
                  ))}
                </select>
              </label>
              <button disabled={!modeloPlantilla} onClick={() => setMostrarAgregarPlantilla(true)}>
                ➕ Agregar producto a la plantilla
              </button>
            </div>

            {!modeloPlantilla ? (
              <p className="inventario-hint">Selecciona un modelo para ver su plantilla de insumos recurrentes.</p>
            ) : (
              <table className="tabla-registro">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Paso</th>
                    <th>Cantidad</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {plantilla.map((t) => (
                    <tr key={t.id_Template}>
                      <td>{t.nombre_Producto}</td>
                      <td>{t.nombre_Paso || "Cualquier paso"}</td>
                      <td>
                        {t.cantidad_Recomendada} {t.unidad_medida}
                      </td>
                      <td className="acciones-botones-shop">
                        <button className="btn-eliminar" onClick={() => handleEliminarPlantilla(t.id_Template)}>
                          Quitar
                        </button>
                      </td>
                    </tr>
                  ))}
                  {plantilla.length === 0 && (
                    <tr>
                      <td colSpan={4}>Sin productos configurados todavía.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </section>
        )}

        {tab === "solicitudes" && (
          <section className="inventario-solicitudes">
            {solicitudes.map((s) => (
              <div key={s.id_Solicitud} className="solicitud-card">
                <div className="solicitud-card-header">
                  <div>
                    <strong>
                      {s.nombre_Modelo || s.nombre_Modelo_Texto} {s.placa ? `· ${s.placa}` : ""}
                    </strong>
                    <p>
                      {s.nombre_Cliente} · {new Date(s.fecha_Solicitud).toLocaleString()}
                    </p>
                  </div>
                  <span className={`solicitud-estado solicitud-estado--${s.estado}`}>{s.estado}</span>
                </div>
                <ul>
                  {s.productos.map((p) => (
                    <li key={p.id_Detalle}>
                      {p.nombre_Producto} — {p.cantidad} {p.unidad_medida}
                    </li>
                  ))}
                </ul>
                {s.estado === "pendiente" && (
                  <button onClick={() => handleMarcarEntregada(s.id_Solicitud)}>Marcar como entregada</button>
                )}
              </div>
            ))}
            {solicitudes.length === 0 && <p className="inventario-hint">Aún no hay solicitudes.</p>}
          </section>
        )}

        {mostrarCrearProducto && (
          <PopUp onClose={() => setMostrarCrearProducto(false)} title="Nuevo Producto">
            <form onSubmit={handleCrearProducto} className="popup-form">
              <input
                type="text"
                placeholder="Nombre del producto"
                value={nombreProducto}
                onChange={(e) => setNombreProducto(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Unidad de medida (ej: galón, unidad)"
                value={unidadProducto}
                onChange={(e) => setUnidadProducto(e.target.value)}
              />
              <button type="submit">Crear</button>
            </form>
          </PopUp>
        )}

        {mostrarCrearModelo && (
          <PopUp onClose={() => setMostrarCrearModelo(false)} title="Nuevo Modelo">
            <form onSubmit={handleCrearModelo} className="popup-form">
              <input
                type="text"
                placeholder="Ej: NS 200"
                value={nombreModelo}
                onChange={(e) => setNombreModelo(e.target.value)}
                required
              />
              <button type="submit">Crear</button>
            </form>
          </PopUp>
        )}

        {mostrarAgregarPlantilla && (
          <PopUp onClose={() => setMostrarAgregarPlantilla(false)} title="Agregar producto a la plantilla">
            <form onSubmit={handleAgregarPlantilla} className="popup-form">
              <select value={productoPlantilla} onChange={(e) => setProductoPlantilla(e.target.value)} required>
                <option value="">-- Producto --</option>
                {productos.map((p) => (
                  <option key={p.id_Producto} value={p.id_Producto}>
                    {p.nombre_Producto}
                  </option>
                ))}
              </select>
              <select value={pasoPlantilla} onChange={(e) => setPasoPlantilla(e.target.value)}>
                <option value="">Aplica en cualquier paso</option>
                {pasos.map((p) => (
                  <option key={p.id_Paso} value={p.id_Paso}>
                    {p.nombre_Paso}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={cantidadPlantilla}
                onChange={(e) => setCantidadPlantilla(e.target.value)}
              />
              <button type="submit">Agregar</button>
            </form>
          </PopUp>
        )}
      </div>
      <Footer />
    </div>
  );
}
