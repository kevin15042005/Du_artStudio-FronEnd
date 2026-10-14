import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../../Components/layout";
import Footer from "../../../Components/Footer/footer";
import Animacion from "../../../Components/Animacion/Animacion";
import PopUp from "../../../Components/popup/popup";
import "./Vehiculos.css";

const API = import.meta.env.VITE_API_URL;

export default function Vehiculos() {
  const [vehiculos, setVehiculos] = useState([]);
  const [pasos, setPasos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [resultadoSolicitud, setResultadoSolicitud] = useState(null);

  const admin = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  const cargar = async () => {
    setCargando(true);
    try {
      const [vRes, pRes] = await Promise.all([
        axios.get(`${API}/proceso/vehiculos`),
        axios.get(`${API}/proceso/pasos`),
      ]);
      setVehiculos(vRes.data);
      setPasos(pRes.data);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleCambiarPaso = async (id_Vehiculo, id_Paso) => {
    await axios.put(`${API}/proceso/vehiculos/${id_Vehiculo}/paso`, { id_Paso });
    cargar();
  };

  const handleFinalizar = async (id_Vehiculo) => {
    if (!window.confirm("¿Marcar este vehículo como finalizado?")) return;
    await axios.put(`${API}/proceso/vehiculos/${id_Vehiculo}/finalizar`);
    cargar();
  };

  const handleSolicitar = async (id_Vehiculo) => {
    try {
      const res = await axios.post(`${API}/inventario/solicitar`, {
        id_Vehiculo,
        id_Administrador: admin?.id_Administrador,
      });
      setResultadoSolicitud(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "❌ No se pudo generar la solicitud");
    }
  };

  return (
    <div className="vehiculos-container">
      <Layout />
      <div className="contenido-vehiculos">
        <Animacion texto="Motos en Taller" />

        {cargando ? (
          <p className="inventario-hint">Cargando...</p>
        ) : (
          <table className="tabla-registro">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Modelo</th>
                <th>Placa</th>
                <th>Ingreso</th>
                <th>Paso actual</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {vehiculos.map((v) => (
                <tr key={v.id_Vehiculo}>
                  <td>
                    {v.nombre_Cliente}
                    <br />
                    <small>{v.correo_Cliente}</small>
                  </td>
                  <td>{v.nombre_Modelo || v.nombre_Modelo_Texto || "—"}</td>
                  <td>{v.placa || "—"}</td>
                  <td>{new Date(v.fecha_Ingreso).toLocaleDateString()}</td>
                  <td>
                    <select
                      value={v.id_Paso_Actual || ""}
                      disabled={v.estado === "finalizado"}
                      onChange={(e) => handleCambiarPaso(v.id_Vehiculo, e.target.value)}
                    >
                      {pasos.map((p) => (
                        <option key={p.id_Paso} value={p.id_Paso}>
                          {p.orden}. {p.nombre_Paso}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <span className={`vehiculo-estado vehiculo-estado--${v.estado}`}>
                      {v.estado === "finalizado" ? "Finalizado" : "En proceso"}
                    </span>
                  </td>
                  <td className="acciones-botones-shop">
                    <button className="btn-solicitar" onClick={() => handleSolicitar(v.id_Vehiculo)}>
                      Solicitar materiales
                    </button>
                    {v.estado !== "finalizado" && (
                      <button className="btn-finalizar" onClick={() => handleFinalizar(v.id_Vehiculo)}>
                        Finalizar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {vehiculos.length === 0 && (
                <tr>
                  <td colSpan={7}>Todavía no hay vehículos registrados por clientes.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {resultadoSolicitud && (
          <PopUp onClose={() => setResultadoSolicitud(null)} title="Materiales solicitados">
            <ul className="solicitud-resultado-lista">
              {resultadoSolicitud.productos.map((p) => (
                <li key={p.id_Detalle}>
                  {p.nombre_Producto} — {p.cantidad} {p.unidad_medida}
                </li>
              ))}
            </ul>
          </PopUp>
        )}
      </div>
      <Footer />
    </div>
  );
}
