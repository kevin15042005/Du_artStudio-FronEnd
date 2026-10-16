# DUART-STUDIO Frontend

Sitio web y panel administrativo de un taller de pintura y personalización de motocicletas en Bogotá, con tienda por catálogo, chatbot, zona de cliente para seguir el proceso de pintura de su moto y gestión de vehículos e inventario.

---

## Integrantes

| Integrante | Rol |
|---|---|
| [Nombre del integrante 1] | [Rol] |
| [Nombre del integrante 2] | [Rol] |
| [Nombre del integrante 3] | [Rol] |

---

## Tecnologías

| Tecnología | Uso en el proyecto |
|---|---|
| **React 19** | Librería de interfaz; componentes funcionales con hooks. |
| **Vite** | Servidor de desarrollo y empaquetado de producción (`@vitejs/plugin-react-swc`). |
| **React Router** | Enrutamiento del lado del cliente (`react-router-dom` v7) y rutas protegidas. |
| **Tailwind CSS** | Dependencia de estilos incluida en el proyecto; la mayor parte de los estilos se define en archivos CSS por componente. |
| **axios** | Cliente HTTP usado en el slider de aliados, el registro de administradores, inventario y vehículos (el resto de llamadas usa `fetch`). |
| **SweetAlert2** | Dependencia incluida para alertas y diálogos modales. |
| **Context API** | Estado global: sesión de administrador, sesión de cliente y carrito de compras. |
| **Vercel** | Plataforma de despliegue del sitio. |

### Servicios externos

| Servicio | Uso |
|---|---|
| **Cloudinary** | Alojamiento de las imágenes que publica el panel (noticias, pintura, tienda, aliados) y de imágenes fijas del sitio. |
| **WhatsApp** | Botón flotante de contacto y envío del pedido del carrito como mensaje mediante enlaces `wa.me`. |
| **Web3Forms** | Envío del formulario de la página de contacto. |
| **YouTube** | Video embebido de presentación en la página de inicio. |

---

## Arquitectura general

El frontend es una **SPA (Single Page Application)** construida con React y Vite que consume la API REST del backend. La URL base de la API se toma de la variable `VITE_API_URL`, y cada página o servicio realiza las peticiones a los módulos correspondientes (`/noticias`, `/pintura`, `/Shop`, `/api/aliados`, `/admin`, `/cliente`, `/proceso`, `/inventario`).

En `src/main.jsx` se monta el árbol de proveedores y las rutas:

```
BrowserRouter
└── AuthProvider            # Sesión del administrador (localStorage "isLoggedIn")
    └── ClienteAuthProvider # Sesión del cliente (localStorage "cliente"), registro y login contra /cliente
        └── CarritoProvider # Carrito de la tienda en memoria
            └── Routes
```

Las rutas del panel se envuelven en `ProtectedRoute`, que redirige a `/Loging` si no hay sesión de administrador; la ruta de cliente se envuelve en `ProtectedRouteCliente`, que redirige a `/ClienteLogin`. El componente `Layout` muestra la barra de navegación pública o la del administrador según la sesión e incluye en todas las páginas el botón de WhatsApp y el chatbot. El chatbot funciona sin IA, con respuestas basadas en palabras clave (`chatbotRespuestas.js`). Vercel reescribe todas las rutas hacia `index.html` (`vercel.json`) para que el enrutamiento del cliente funcione al recargar.

### Estructura de `src/`

```
src/
├── main.jsx        # Punto de entrada: proveedores de contexto y definición de rutas
├── App.jsx         # Página de inicio: bienvenida, carrusel, video de YouTube y slider de marcas aliadas
├── assets/         # Imágenes, íconos de redes sociales, logos de marcas y video
├── Components/     # Componentes reutilizables: Navbar, NavbarNoticias, Footer, layout, ChatBot, WhatsApp, Slider, Loader, Animacion, popups del carrito, animaciones de scroll y rutas protegidas
├── context/        # AuthContext (administrador), ClienteAuthContext (cliente) y CarritoContext (carrito)
├── Pages/          # Páginas públicas (Nosotros, Pintura, Noticias, Compra, Contacto, Login), zona de cliente (Cliente/) y panel administrativo (Crud/)
└── services/       # procesoService.js: llamadas a /proceso y /cliente para el seguimiento del proceso de pintura
```

---

## Rutas

| Ruta | Descripción | Acceso |
|---|---|---|
| `/` | Inicio: bienvenida, información del taller, video y marcas aliadas. | Pública |
| `/Nosotros` | Información sobre el taller. | Pública |
| `/Pintura` | Galería de trabajos de pintura publicados. | Pública |
| `/Noticias` | Noticias publicadas por el taller. | Pública |
| `/Compra` | Tienda por catálogo con carrito; el pedido se envía por WhatsApp. | Pública |
| `/Contacto` | Formulario de contacto (Web3Forms) y enlace a WhatsApp. | Pública |
| `/Loging` | Inicio de sesión y recuperación de contraseña con PIN para administradores. | Pública |
| `/ClienteLogin` | Registro e inicio de sesión de clientes. | Pública |
| `/MiProceso` | Registro de motos del cliente y seguimiento del paso actual del proceso de pintura. | Cliente |
| `/CrudNoticias` | Gestión (crear, editar, eliminar) de noticias. | Administrador |
| `/CrudNoticiasPintura` | Gestión de publicaciones de trabajos de pintura. | Administrador |
| `/Shop` | Gestión de artículos de la tienda. | Administrador |
| `/Registrar` | Gestión de cuentas de administrador. | Administrador |
| `/Aliados` | Gestión de marcas aliadas. | Administrador |
| `/Inventario` | Gestión de productos, plantillas de insumos por modelo y solicitudes de materiales. | Administrador |
| `/Vehiculos` | Gestión de vehículos en taller y avance de su proceso de pintura. | Administrador |

---

## Instalación y ejecución

Requisitos: Node.js 18 o superior y acceso a una instancia del backend.

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd Du_artStudio-FronEnd

# 2. Instalar dependencias
npm install

# 3. Crear el archivo de entorno a partir de la plantilla y completar el valor
cp .env.example .env

# 4. Ejecutar en modo desarrollo (http://localhost:5173)
npm run dev

# 5. Generar la versión de producción en dist/
npm run build
```

Para previsualizar la versión de producción localmente se puede usar `npm run preview`.

El backend admite por CORS los orígenes `http://localhost:5173` (`npm run dev`) y `http://localhost:4173` (`npm run preview`), por lo que el entorno local puede apuntar `VITE_API_URL` tanto a la API desplegada como a un backend local.

---

## Variables de entorno

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL base de la API REST del backend, sin barra final. Vite la inyecta en el código en tiempo de compilación mediante `import.meta.env.VITE_API_URL`. |

El archivo [.env.example](.env.example) contiene la plantilla. Al modificar esta variable es necesario reiniciar `npm run dev` o volver a ejecutar `npm run build`.

---

## Despliegue

| Componente | Plataforma | URL |
|---|---|---|
| Frontend (este repositorio) | Vercel | https://du-art-studio-fron-end.vercel.app |
| API REST | Render | https://du-artstudio-backend.onrender.com |

En Vercel, el proyecto usa `npm run build` como comando de build y `dist/` como directorio de salida. La variable `VITE_API_URL` se configura en el panel del proyecto en Vercel.
