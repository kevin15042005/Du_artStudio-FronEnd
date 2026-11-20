// Pages/Cliente/ProcesoPintura/ProcesoPintura.jsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Layout from "../../../Components/layout";
import Footer from "../../../Components/Footer/footer";
import { useClienteAuth } from "../../../context/ClienteAuthContext.jsx";
import {
  obtenerPasos,
  obtenerModelos,
  obtenerVehiculosCliente,
  registrarVehiculo,
} from "../../../services/procesoService.js";
import "./ProcesoPintura.css";

// Cada cuánto se consulta el estado de las motos mientras la pestaña está visible
const INTERVALO_ACTUALIZACION_MS = 10000;

const notificacion = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 6000,
  timerProgressBar: true,
  background: "#1c1920",
  color: "#f3f1f6",
});

const nombreMoto = (v) =>
  `${v.nombre_Modelo || v.nombre_Modelo_Texto || "moto"}${v.placa ? ` (${v.placa})` : ""}`;

// Compara el estado anterior con el nuevo y avisa de cada cambio
function avisarCambios(anteriores, nuevos) {
  for (const v of nuevos) {
    const antes = anteriores.get(v.id_Vehiculo);
    if (!antes) continue;
    if (v.estado === "finalizado" && antes.estado !== "finalizado") {
      notificacion.fire({ icon: "success", title: `¡Tu ${nombreMoto(v)} está lista! 🎉`, text: "El proceso de pintura terminó." });
    } else if (v.estado === "en_proceso" && v.paso_orden !== antes.paso_orden) {
      notificacion.fire({
        icon: "info",
        title: `Tu ${nombreMoto(v)} avanzó`,
        text: `Ahora está en ${v.nombre_Paso} (paso ${v.paso_orden} de ${v.total_pasos}).`,
      });
    }
  }
}

export default function ProcesoPintura() {
  const navigate = useNavigate();
  const { clienteActual, logoutCliente } = useClienteAuth();

  const [pasos, setPasos] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  // Se guarda el id (no una copia) para que la línea de tiempo refleje siempre los datos más recientes
  const [idSeleccionado, setIdSeleccionado] = useState(null);
  const estadoAnterior = useRef(new Map());
  const [cargando, setCargando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const [idModelo, setIdModelo] = useState("");
  const [modeloTexto, setModeloTexto] = useState("");
  const [placa, setPlaca] = useState("");
  const [color, setColor] = useState("");

  const cargarDatos = async () => {
    if (!clienteActual) return;
    setCargando(true);
    try {
      const [pasosData, modelosData, vehiculosData] = await Promise.all([
        obtenerPasos(),
        obtenerModelos(),
        obtenerVehiculosCliente(clienteActual.id_Cliente),
      ]);
      setPasos(pasosData);
      setModelos(modelosData);
      setVehiculos(vehiculosData);
      guardarEstado(vehiculosData);
      setMostrarFormulario(vehiculosData.length === 0);
    } catch (err) {
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  function guardarEstado(lista) {
    estadoAnterior.current = new Map(lista.map((v) => [v.id_Vehiculo, { paso_orden: v.paso_orden, estado: v.estado }]));
  }

  // Consulta en segundo plano: actualiza la línea de tiempo y avisa si algo cambió
  const actualizarEstado = useCallback(async () => {
    if (!clienteActual) return;
    try {
      const vehiculosData = await obtenerVehiculosCliente(clienteActual.id_Cliente);
      avisarCambios(estadoAnterior.current, vehiculosData);
      guardarEstado(vehiculosData);
      setVehiculos(vehiculosData);
    } catch (err) {
      console.error("No se pudo actualizar el estado:", err);
    }
  }, [clienteActual]);

  useEffect(() => {
    cargarDatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clienteActual]);

  useEffect(() => {
    if (!clienteActual) return;

    const intervalo = setInterval(() => {
      if (document.visibilityState === "visible") actualizarEstado();
    }, INTERVALO_ACTUALIZACION_MS);

    // Al volver a la pestaña se actualiza de inmediato
    const alVolver = () => {
      if (document.visibilityState === "visible") actualizarEstado();
    };
    document.addEventListener("visibilitychange", alVolver);

    return () => {
      clearInterval(intervalo);
      document.removeEventListener("visibilitychange", alVolver);
    };
  }, [clienteActual, actualizarEstado]);

  if (!clienteActual) return null;

  const handleRegistrarVehiculo = async (e) => {
    e.preventDefault();
    if (!idModelo && !modeloTexto.trim()) {
      alert("Selecciona un modelo del catálogo o escribe uno");
      return;
    }

    setGuardando(true);
    try {
      await registrarVehiculo(clienteActual.id_Cliente, {
        id_Modelo: idModelo || null,
        nombre_Modelo_Texto: idModelo ? null : modeloTexto.trim(),
        placa,
        color,
      });
      setIdModelo("");
      setModeloTexto("");
      setPlaca("");
      setColor("");
      setMostrarFormulario(false);
      await cargarDatos();
    } catch (err) {
      alert(err.message || "No se pudo registrar el vehículo");
    } finally {
      setGuardando(false);
    }
  };

  const handleLogout = () => {
    logoutCliente();
    navigate("/ClienteLogin");
  };

  const vehiculoSeleccionado =
    vehiculos.find((v) => v.id_Vehiculo === idSeleccionado) ?? vehiculos[0] ?? null;
  const pasoActualOrden = vehiculoSeleccionado?.paso_orden ?? 0;
  const finalizado = vehiculoSeleccionado?.estado === "finalizado";

  return (
    <div id="main-container">
      <Layout />
      <main className="proceso-container">
        <div className="proceso-cabecera">
          <div>
            <h1>Hola, {clienteActual.nombre_Cliente}</h1>
            <p className="proceso-subtitulo">Este es el estado del proceso de tu moto</p>
          </div>
          <button className="proceso-boton-secundario" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>

        {cargando ? (
          <p className="proceso-cargando">Cargando...</p>
        ) : (
          <>
            {vehiculos.length > 0 && (
              <div className="proceso-vehiculos-lista">
                {vehiculos.map((v) => (
                  <button
                    key={v.id_Vehiculo}
                    className={`proceso-chip-vehiculo ${
                      vehiculoSeleccionado?.id_Vehiculo === v.id_Vehiculo ? "activo" : ""
                    }`}
                    onClick={() => setIdSeleccionado(v.id_Vehiculo)}
                  >
                    {v.nombre_Modelo || v.nombre_Modelo_Texto || "Moto"}
                    {v.placa ? ` · ${v.placa}` : ""}
                    {v.estado === "finalizado" ? " ✅" : ""}
                  </button>
                ))}
                <button
                  className="proceso-chip-vehiculo proceso-chip-nueva"
                  onClick={() => setMostrarFormulario((v) => !v)}
                >
                  + Registrar otro vehículo
                </button>
              </div>
            )}

            {mostrarFormulario && (
              <form className="proceso-formulario" onSubmit={handleRegistrarVehiculo}>
                <h3>Registrar vehículo</h3>
                <div className="proceso-form-grid">
                  <label>
                    Modelo (catálogo)
                    <select value={idModelo} onChange={(e) => setIdModelo(e.target.value)}>
                      <option value="">-- Otro / no está en la lista --</option>
                      {modelos.map((m) => (
                        <option key={m.id_Modelo} value={m.id_Modelo}>
                          {m.nombre_Modelo}
                        </option>
                      ))}
                    </select>
                  </label>

                  {!idModelo && (
                    <label>
                      ¿Cuál es el modelo?
                      <input
                        type="text"
                        placeholder="Ej: Bajaj NS200"
                        value={modeloTexto}
                        onChange={(e) => setModeloTexto(e.target.value)}
                      />
                    </label>
                  )}

                  <label>
                    Placa (opcional)
                    <input type="text" value={placa} onChange={(e) => setPlaca(e.target.value)} />
                  </label>

                  <label>
                    Color (opcional)
                    <input type="text" value={color} onChange={(e) => setColor(e.target.value)} />
                  </label>
                </div>

                <button type="submit" disabled={guardando}>
                  {guardando ? "Guardando..." : "Registrar y empezar seguimiento"}
                </button>
              </form>
            )}

            {vehiculoSeleccionado && !mostrarFormulario && (
              <div className="proceso-timeline-wrap">
                <h2>
                  {vehiculoSeleccionado.nombre_Modelo || vehiculoSeleccionado.nombre_Modelo_Texto}
                  {vehiculoSeleccionado.placa ? ` · ${vehiculoSeleccionado.placa}` : ""}
                </h2>
                {finalizado && <p className="proceso-badge-final">🏁 Proceso finalizado</p>}

                <ol className="proceso-timeline">
                  {pasos.map((paso) => {
                    let estadoPaso = "pendiente";
                    if (finalizado || paso.orden < pasoActualOrden) estadoPaso = "completado";
                    else if (paso.orden === pasoActualOrden) estadoPaso = "en-curso";

                    return (
                      <li key={paso.id_Paso} className={`proceso-paso proceso-paso--${estadoPaso}`}>
                        <span className="proceso-paso-punto" />
                        <div>
                          <p className="proceso-paso-nombre">{paso.nombre_Paso}</p>
                          <p className="proceso-paso-estado">
                            {estadoPaso === "completado" && "Completado"}
                            {estadoPaso === "en-curso" && "En proceso"}
                            {estadoPaso === "pendiente" && "Pendiente"}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
