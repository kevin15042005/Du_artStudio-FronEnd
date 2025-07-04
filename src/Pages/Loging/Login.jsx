import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../Components/layout";
import Footer from "../../Components/Footer/footer";
import { useAuth } from "../../Components/AuthContext/AuthContext.jsx";
import "./Loging.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [registrarData, setRegistrarData] = useState({
    nombre: "",
    correo: "",
    contraseña: "",
    rol: "Administrador",
  });

  const [currentForm, setCurrentForm] = useState("loging");

  const [showPassword, setShowPassword] = useState(false);

  const changeForm = (formName) => {
    setCurrentForm(formName);
    localStorage.setItem("currentForm", formName);
  };

  const handleClick = () => {
    window.scrollTo(0, 0);
  };
  // Iniciar sesión
  const handleIniciar = async (e) => {
    e.preventDefault();

    const email = e.target.correo.value;
    const password = e.target.contraseña.value;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo_Administrador: email,
          contraseña_Administrador: password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Inicio de sesión exitoso");
        localStorage.setItem("user", JSON.stringify(data.usuario));
        login();

        navigate("/CrudNoticias");
      } else {
        alert(data.message || "Credenciales inválidas");
        localStorage.setItem("isLoging", "false");
      }
    } catch {
      console.log("Error al iniciar sesión");
      alert("Error al iniciar sesión");
      localStorage.setItem("isLogin", "false");
    }
  };

  // Actualizar contraseña
  const handleActualizar = async (e) => {
    e.preventDefault();

    const correo = e.target.correo.value;
    const pinSeguridad = e.target.forgetPassword.value;
    const nuevaContraseña = e.target.newPassword.value;

    // Validaciones
    if (!correo || !pinSeguridad || !nuevaContraseña) {
      alert("Todos los campos son obligatorios");
      return;
    }

    if (nuevaContraseña.length < 8) {
      alert("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    if (!/^\d{4}$/.test(pinSeguridad)) {
      alert("El PIN debe ser de exactamente 4 dígitos");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo_Administrador: correo,
          pin_seguridad: pinSeguridad,
          nuevaContraseña: nuevaContraseña,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("¡Contraseña actualizada correctamente!");
        changeForm("loging"); // Volver al formulario de login
      } else {
        alert(data.message || "Error al actualizar la contraseña");
      }
    } catch (err) {
      console.error("Error al actualizar contraseña:", err);
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <>
      <div id="main-container">
        <Layout />
        <main className="formulararioPrincipal">
          {/* Login */}
          {currentForm === "loging" && (
            <div className="Menu-Loging">
              <form className="Texto" onSubmit={handleIniciar}>
                <h2>Ingreso</h2>
                <div className="input-box">
                  <label>Usuario</label>
                  <input
                    type="text"
                    className="field"
                    placeholder="Correo"
                    name="correo"
                    required
                  />
                </div>
                <div className="input-box">
                  <label>Contraseña</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="field"
                    placeholder="Contraseña"
                    name="contraseña"
                    required
                  />
                  <div className="input-check">
                    <h4>Mostrar contraseña</h4>
                    <input
                      type="checkbox"
                      onChange={() => setShowPassword(!showPassword)}
                    />
                  </div>
                </div>
                <div className="button-ingresar">
                  <button
                    type="submit"
                    className="ingresarButton"
                    onClick={handleClick}
                  >
                    Ingresar
                  </button>
                  <div className="usuarioNewRegister">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        changeForm("forgotPassword");
                      }}
                    >
                      Olvidé mi contraseña
                    </a>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Recuperar Contraseña */}
          {currentForm === "forgotPassword" && (
            <div className="Menu-Password">
              <form className="Texto" onSubmit={handleActualizar}>
                <h2>Recuperar Contraseña</h2>

                <div className="input-box">
                  <label>Correo Electrónico</label>
                  <input
                    type="email"
                    className="field"
                    placeholder="Ingrese su correo"
                    name="correo"
                    required
                  />
                </div>

                <div className="input-box">
                  <label>PIN de Seguridad (4 dígitos)</label>
                  <input
                    type="password"
                    className="field"
                    placeholder="Ingrese su PIN"
                    name="forgetPassword"
                    pattern="\d{4}"
                    maxLength={4}
                    required
                  />
                </div>

                <div className="input-box">
                  <label>Nueva Contraseña</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="field"
                    placeholder="Mínimo 8 caracteres"
                    name="newPassword"
                    minLength={8}
                    required
                  />
                  <div className="input-check">
                    <span>Mostrar contraseña</span>
                    <input
                      type="checkbox"
                      onChange={() => setShowPassword(!showPassword)}
                    />
                  </div>
                </div>

                <div className="button-contraseña">
                  <button type="submit" className="registerButton">
                    Actualizar Contraseña
                  </button>
                </div>

                <div className="VolverInicio">
                  <button
                    type="button"
                    className="back-button"
                    onClick={() => changeForm("loging")}
                  >
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
    </>
  );
}
