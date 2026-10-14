// Pages/Cliente/LoginCliente/LoginCliente.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../../Components/layout";
import Footer from "../../../Components/Footer/footer";
import { useClienteAuth } from "../../../context/ClienteAuthContext.jsx";
import "../../Login/Login.css";
import "./LoginCliente.css";

export default function LoginCliente() {
  const navigate = useNavigate();
  const { loginCliente, registerCliente } = useClienteAuth();

  const [currentForm, setCurrentForm] = useState("loging");
  const [showPassword, setShowPassword] = useState(false);
  const [cargando, setCargando] = useState(false);

  const changeForm = (formName) => setCurrentForm(formName);

  const handleLogin = async (e) => {
    e.preventDefault();
    const correo = e.target.correo.value;
    const contraseña = e.target.contraseña.value;

    setCargando(true);
    try {
      await loginCliente(correo, contraseña);
      navigate("/MiProceso");
    } catch (err) {
      alert(err.message || "No se pudo iniciar sesión");
    } finally {
      setCargando(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const nombre_Cliente = e.target.nombre.value;
    const correo_Cliente = e.target.correo.value;
    const telefono_Cliente = e.target.telefono.value;
    const contraseña_Cliente = e.target.contraseña.value;
    const confirmar = e.target.confirmar.value;

    if (contraseña_Cliente !== confirmar) {
      alert("Las contraseñas no coinciden");
      return;
    }

    setCargando(true);
    try {
      await registerCliente({ nombre_Cliente, correo_Cliente, contraseña_Cliente, telefono_Cliente });
      await loginCliente(correo_Cliente, contraseña_Cliente);
      navigate("/MiProceso");
    } catch (err) {
      alert(err.message || "No se pudo crear la cuenta");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div id="main-container">
      <Layout />
      <main className="formulararioPrincipal">
        {currentForm === "loging" && (
          <div className="Menu-Loging">
            <form className="Texto" onSubmit={handleLogin}>
              <h2>Ingresa a tu cuenta</h2>
              <p className="cliente-subtitulo">Consulta el proceso de pintura de tu moto</p>

              <div className="input-box">
                <label>Correo</label>
                <input type="email" className="field" name="correo" placeholder="Correo" required />
              </div>

              <div className="input-box">
                <label>Contraseña</label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="field"
                  name="contraseña"
                  placeholder="Contraseña"
                  required
                />
                <div className="input-check">
                  <h4>Mostrar contraseña</h4>
                  <input type="checkbox" onChange={() => setShowPassword(!showPassword)} />
                </div>
              </div>

              <div className="button-ingresar">
                <button type="submit" className="ingresarButton" disabled={cargando}>
                  {cargando ? "Ingresando..." : "Ingresar"}
                </button>
                <div className="usuarioNewRegister">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      changeForm("register");
                    }}
                  >
                    ¿No tienes cuenta? Crear una
                  </a>
                </div>
              </div>
            </form>
          </div>
        )}

        {currentForm === "register" && (
          <div className="Menu-Register">
            <form className="Texto" onSubmit={handleRegister}>
              <h2>Crea tu cuenta</h2>

              <div className="input-box">
                <label>Nombre</label>
                <input type="text" className="field" name="nombre" placeholder="Nombre completo" required />
              </div>

              <div className="input-box">
                <label>Correo</label>
                <input type="email" className="field" name="correo" placeholder="Correo" required />
              </div>

              <div className="input-box">
                <label>Teléfono</label>
                <input type="tel" className="field" name="telefono" placeholder="Teléfono (opcional)" />
              </div>

              <div className="input-box">
                <label>Contraseña</label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="field"
                  name="contraseña"
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                  required
                />
              </div>

              <div className="input-box">
                <label>Confirmar contraseña</label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="field"
                  name="confirmar"
                  placeholder="Repite la contraseña"
                  minLength={6}
                  required
                />
                <div className="input-check">
                  <span>Mostrar contraseñas</span>
                  <input type="checkbox" onChange={() => setShowPassword(!showPassword)} />
                </div>
              </div>

              <div className="button-contraseña">
                <button type="submit" className="registerButton" disabled={cargando}>
                  {cargando ? "Creando..." : "Crear cuenta"}
                </button>
              </div>

              <div className="VolverInicio">
                <button type="button" className="back-button" onClick={() => changeForm("loging")}>
                  Volver al inicio de sesión
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
