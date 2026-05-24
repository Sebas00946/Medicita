# 🖥️ MediCita Web — Frontend Guide
> React.js · Vite · React Router · Axios · Context API · Tailwind CSS

---

## 📋 Tabla de Contenido

1. [Requisitos previos](#1-requisitos-previos)
2. [Crear el proyecto desde cero](#2-crear-el-proyecto-desde-cero)
3. [Estructura de carpetas](#3-estructura-de-carpetas)
4. [Variables de entorno](#4-variables-de-entorno)
5. [Instalar dependencias](#5-instalar-dependencias)
6. [Configuración base](#6-configuración-base)
7. [Context API — AuthContext](#7-context-api--authcontext)
8. [Servicio Axios](#8-servicio-axios)
9. [Rutas y navegación](#9-rutas-y-navegación)
10. [Páginas y componentes](#10-páginas-y-componentes)
11. [Hooks personalizados](#11-hooks-personalizados)
12. [Estilos con Tailwind CSS](#12-estilos-con-tailwind-css)
13. [Scripts disponibles](#13-scripts-disponibles)
14. [Conectar con el Backend](#14-conectar-con-el-backend)
15. [Subir a GitHub](#15-subir-a-github)

---

## 1. Requisitos previos

Los mismos del backend más:

| Herramienta | Versión mínima | Descarga |
|-------------|---------------|---------|
| Node.js | 20.x LTS | https://nodejs.org |
| npm | 10.x | — |

> El backend debe estar corriendo en `http://localhost:4000` antes de probar el frontend.

---

## 2. Crear el proyecto desde cero

### Paso 1 — Crear el proyecto React con Vite

> Ejecuta esto desde la carpeta raíz `medicita-web/` (donde ya está la carpeta `backend/`)

```bash
# Desde medicita-web/
npm create vite@latest frontend -- --template react

cd frontend
```

Vite te preguntará:
- **Framework:** React ✅
- **Variant:** JavaScript ✅ (no TypeScript por ahora)

### Paso 2 — Verificar que funciona

```bash
npm install
npm run dev
```

Abre `http://localhost:5173` — debes ver la pantalla de bienvenida de Vite + React.

### Paso 3 — Limpiar archivos innecesarios de Vite

```bash
# Elimina los archivos que no necesitamos
rm src/App.css
rm src/assets/react.svg
rm public/vite.svg
```

Deja el `src/index.css` vacío (lo vamos a reemplazar con Tailwind).

---

## 3. Estructura de carpetas

Crea exactamente esta estructura dentro de `/frontend/src`:

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.jsx          ← botón reutilizable
│   │   │   ├── Input.jsx           ← campo de texto
│   │   │   ├── Badge.jsx           ← etiqueta de estado
│   │   │   └── LoadingSpinner.jsx  ← indicador de carga
│   │   ├── layout/
│   │   │   ├── Navbar.jsx          ← barra de navegación
│   │   │   └── PrivateRoute.jsx    ← protección de rutas
│   │   └── appointments/
│   │       ├── AppointmentCard.jsx ← tarjeta de cita
│   │       └── AppointmentList.jsx ← lista de citas
│   ├── context/
│   │   └── AuthContext.jsx         ← estado global de autenticación
│   ├── hooks/
│   │   ├── useMedicos.js           ← hook para listar médicos
│   │   └── useCitas.js             ← hook para gestionar citas
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── CitasPage.jsx
│   │   ├── NuevaCitaPage.jsx
│   │   └── DashboardPage.jsx
│   ├── services/
│   │   ├── api.js                  ← instancia Axios configurada
│   │   ├── authService.js
│   │   └── citasService.js
│   ├── App.jsx                     ← rutas principales
│   └── main.jsx                    ← punto de entrada React
├── .env.example
├── .env.local                      ← NO subir a Git
├── index.html
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

### Crear las carpetas:

```bash
# Desde /frontend/src
mkdir -p components/ui
mkdir -p components/layout
mkdir -p components/appointments
mkdir -p context
mkdir -p hooks
mkdir -p pages
mkdir -p services
```

---

## 4. Variables de entorno

### `.env.example` (subir a Git):

```bash
# Desde /frontend
cat > .env.example << 'EOF'
VITE_API_URL=http://localhost:4000/api
EOF
```

### `.env.local` (NO subir a Git):

```bash
cat > .env.local << 'EOF'
VITE_API_URL=http://localhost:4000/api
EOF
```

> En Vite, las variables de entorno deben comenzar con `VITE_` para ser accesibles desde el código del navegador.

---

## 5. Instalar dependencias

```bash
# Desde /frontend
npm install react-router-dom axios

# Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### ¿Para qué sirve cada una?

| Paquete | Uso |
|---------|-----|
| `react-router-dom` | Navegación entre páginas (SPA) |
| `axios` | Peticiones HTTP al backend |
| `tailwindcss` | Estilos utilitarios CSS |
| `postcss` | Procesador CSS (requerido por Tailwind) |
| `autoprefixer` | Compatibilidad CSS entre navegadores |

---

## 6. Configuración base

### `tailwind.config.js` — Configurar Tailwind

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta de colores de MediCita Web
        primary: {
          50:  '#E8F1FB',
          100: '#D6E4F0',
          500: '#2E75B6',
          700: '#1F4E79',
          900: '#0F2847',
        },
        success: '#27AE60',
        warning: '#F5A623',
        danger:  '#E74C3C',
      },
    },
  },
  plugins: [],
}
```

### `src/index.css` — Importar Tailwind

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Estilos globales de MediCita Web */
body {
  @apply bg-gray-50 text-gray-800;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
```

### `src/main.jsx` — Punto de entrada

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

---

## 7. Context API — AuthContext

Este contexto almacena el estado de la sesión (quién está logueado) y lo hace disponible en toda la app.

### `src/context/AuthContext.jsx`

```jsx
import { createContext, useContext, useState, useCallback } from 'react';

// 1. Crear el contexto
const AuthContext = createContext(null);

// 2. Provider — envuelve toda la app
export const AuthProvider = ({ children }) => {
  // Intentar recuperar sesión guardada
  const [usuario, setUsuario] = useState(() => {
    try {
      const stored = localStorage.getItem('medicita_usuario');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Guardar sesión al hacer login
  const login = useCallback((datosUsuario, token) => {
    localStorage.setItem('medicita_token',   token);
    localStorage.setItem('medicita_usuario', JSON.stringify(datosUsuario));
    setUsuario(datosUsuario);
  }, []);

  // Limpiar sesión al hacer logout
  const logout = useCallback(() => {
    localStorage.removeItem('medicita_token');
    localStorage.removeItem('medicita_usuario');
    setUsuario(null);
  }, []);

  const estaAutenticado = Boolean(usuario);

  return (
    <AuthContext.Provider value={{ usuario, login, logout, estaAutenticado }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Hook personalizado para consumir el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};
```

---

## 8. Servicio Axios

### `src/services/api.js` — Instancia configurada

```javascript
import axios from 'axios';

// Crear instancia con configuración base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Interceptor de SOLICITUD ─────────────────────────────────────────────
// Adjunta el JWT en cada petición protegida automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('medicita_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Interceptor de RESPUESTA ─────────────────────────────────────────────
// Manejo centralizado de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado — limpiar sesión y redirigir al login
      localStorage.removeItem('medicita_token');
      localStorage.removeItem('medicita_usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### `src/services/authService.js`

```javascript
import api from './api';

export const loginApi = async (email, contrasena) => {
  const { data } = await api.post('/auth/login', { email, contrasena });
  return data; // { token, usuario }
};

export const registroApi = async (nombre, email, contrasena) => {
  const { data } = await api.post('/auth/registro', { nombre, email, contrasena });
  return data;
};
```

### `src/services/citasService.js`

```javascript
import api from './api';

export const obtenerMisCitas = async () => {
  const { data } = await api.get('/citas');
  return data;
};

export const agendarCita = async (datosCita) => {
  const { data } = await api.post('/citas', datosCita);
  return data;
};

export const cancelarCita = async (idCita) => {
  const { data } = await api.patch(`/citas/${idCita}/cancelar`);
  return data;
};

export const obtenerMedicos = async (especialidad = '') => {
  const params = especialidad ? `?especialidad=${especialidad}` : '';
  const { data } = await api.get(`/medicos${params}`);
  return data;
};
```

---

## 9. Rutas y Navegación

### `src/components/layout/PrivateRoute.jsx`

```jsx
import { Navigate } from 'react-router-dom';
import { useAuth }   from '../../context/AuthContext';

// Redirige al login si no hay sesión activa
const PrivateRoute = ({ children, rolesPermitidos }) => {
  const { usuario, estaAutenticado } = useAuth();

  if (!estaAutenticado) {
    return <Navigate to="/login" replace />;
  }

  if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) {
    return <Navigate to="/no-autorizado" replace />;
  }

  return children;
};

export default PrivateRoute;
```

### `src/App.jsx` — Configuración de rutas

```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute     from './components/layout/PrivateRoute';
import Navbar           from './components/layout/Navbar';

// Páginas
import LoginPage    from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CitasPage    from './pages/CitasPage';
import NuevaCitaPage from './pages/NuevaCitaPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 py-8">
          <Routes>

            {/* ── Rutas públicas ─────────────────────────────── */}
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/registro" element={<RegisterPage />} />

            {/* ── Rutas de paciente ──────────────────────────── */}
            <Route path="/citas" element={
              <PrivateRoute rolesPermitidos={['paciente']}>
                <CitasPage />
              </PrivateRoute>
            } />
            <Route path="/citas/nueva" element={
              <PrivateRoute rolesPermitidos={['paciente']}>
                <NuevaCitaPage />
              </PrivateRoute>
            } />

            {/* ── Rutas de administrador ─────────────────────── */}
            <Route path="/admin/dashboard" element={
              <PrivateRoute rolesPermitidos={['administrador']}>
                <DashboardPage />
              </PrivateRoute>
            } />

            {/* ── Redirección por defecto ────────────────────── */}
            <Route path="/"   element={<Navigate to="/login" replace />} />
            <Route path="*"   element={<Navigate to="/login" replace />} />

          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
```

---

## 10. Páginas y componentes

### `src/components/layout/Navbar.jsx`

```jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth }           from '../../context/AuthContext';

const Navbar = () => {
  const { usuario, logout, estaAutenticado } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-primary-700 text-white shadow-md">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="text-xl font-bold tracking-wide">
          🏥 MediCita Web
        </Link>

        {/* Menú */}
        <div className="flex items-center gap-4">
          {estaAutenticado ? (
            <>
              {usuario.rol === 'paciente' && (
                <>
                  <Link to="/citas"        className="hover:text-primary-100 transition">Mis Citas</Link>
                  <Link to="/citas/nueva"  className="hover:text-primary-100 transition">Agendar</Link>
                </>
              )}
              {usuario.rol === 'administrador' && (
                <Link to="/admin/dashboard" className="hover:text-primary-100 transition">Dashboard</Link>
              )}
              <span className="text-primary-100 text-sm">Hola, {usuario.nombre}</span>
              <button
                onClick={handleLogout}
                className="bg-white text-primary-700 px-3 py-1 rounded text-sm font-medium hover:bg-primary-100 transition"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login"    className="hover:text-primary-100 transition">Ingresar</Link>
              <Link to="/registro" className="bg-white text-primary-700 px-3 py-1 rounded text-sm font-medium hover:bg-primary-100 transition">
                Registrarse
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
```

---

### `src/pages/LoginPage.jsx`

```jsx
import { useState }      from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth }       from '../context/AuthContext';
import { loginApi }      from '../services/authService';

const LoginPage = () => {
  const [form, setForm]     = useState({ email: '', contrasena: '' });
  const [error, setError]   = useState('');
  const [cargando, setCargando] = useState(false);

  const { login }  = useAuth();
  const navigate   = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      const { token, usuario } = await loginApi(form.email, form.contrasena);
      login(usuario, token);
      // Redirigir según rol
      navigate(usuario.rol === 'administrador' ? '/admin/dashboard' : '/citas');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

        <div className="text-center mb-8">
          <span className="text-4xl">🏥</span>
          <h1 className="text-2xl font-bold text-primary-700 mt-2">MediCita Web</h1>
          <p className="text-gray-500 text-sm mt-1">Ingresa con tu cuenta</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              name="contrasena"
              value={form.contrasena}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-primary-500 hover:bg-primary-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
          >
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          ¿No tienes cuenta?{' '}
          <Link to="/registro" className="text-primary-500 font-medium hover:underline">
            Regístrate aquí
          </Link>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;
```

---

### `src/pages/RegisterPage.jsx`

```jsx
import { useState }          from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registroApi }       from '../services/authService';

const RegisterPage = () => {
  const [form, setForm]         = useState({ nombre: '', email: '', contrasena: '' });
  const [error, setError]       = useState('');
  const [exito, setExito]       = useState(false);
  const [cargando, setCargando] = useState(false);
  const navigate                = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      await registroApi(form.nombre, form.email, form.contrasena);
      setExito(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrarse');
    } finally {
      setCargando(false);
    }
  };

  if (exito) return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-green-50 border border-green-200 text-green-700 rounded-2xl p-8 text-center">
        <span className="text-4xl">✅</span>
        <p className="mt-3 font-medium">¡Cuenta creada exitosamente!</p>
        <p className="text-sm mt-1">Redirigiendo al login...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

        <div className="text-center mb-8">
          <span className="text-4xl">📋</span>
          <h1 className="text-2xl font-bold text-primary-700 mt-2">Crear cuenta</h1>
          <p className="text-gray-500 text-sm mt-1">Regístrate como paciente</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Nombre completo', name: 'nombre',     type: 'text',     placeholder: 'Ana García' },
            { label: 'Correo electrónico', name: 'email',   type: 'email',    placeholder: 'correo@ejemplo.com' },
            { label: 'Contraseña',      name: 'contrasena', type: 'password', placeholder: '••••••••' },
          ].map(({ label, name, type, placeholder }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type={type} name={name} value={form[name]}
                onChange={handleChange} placeholder={placeholder} required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          ))}

          <button
            type="submit" disabled={cargando}
            className="w-full bg-primary-500 hover:bg-primary-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
          >
            {cargando ? 'Registrando...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-primary-500 font-medium hover:underline">Ingresar</Link>
        </p>

      </div>
    </div>
  );
};

export default RegisterPage;
```

---

### `src/components/appointments/AppointmentCard.jsx`

```jsx
import { useState } from 'react';
import { cancelarCita } from '../../services/citasService';

// Colores y etiquetas por estado
const ESTADOS = {
  pendiente:  { color: 'bg-yellow-100 text-yellow-800',  label: 'Pendiente'  },
  confirmada: { color: 'bg-green-100  text-green-800',   label: 'Confirmada' },
  cancelada:  { color: 'bg-red-100    text-red-800',     label: 'Cancelada'  },
  completada: { color: 'bg-blue-100   text-blue-800',    label: 'Completada' },
};

const AppointmentCard = ({ cita, onCancelada }) => {
  const [cancelando, setCancelando] = useState(false);
  const estado = ESTADOS[cita.estado] || ESTADOS.pendiente;
  const puedeCancel = ['pendiente', 'confirmada'].includes(cita.estado);

  const handleCancelar = async () => {
    if (!confirm('¿Confirmas que deseas cancelar esta cita?')) return;
    setCancelando(true);
    try {
      await cancelarCita(cita.id);
      onCancelada?.(cita.id);
    } catch {
      alert('No se pudo cancelar la cita. Inténtalo de nuevo.');
    } finally {
      setCancelando(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-800">{cita.medico_nombre}</h3>
          <p className="text-primary-500 text-sm">{cita.especialidad}</p>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${estado.color}`}>
          {estado.label}
        </span>
      </div>

      <div className="mt-3 space-y-1 text-sm text-gray-600">
        <p>📅 {new Date(cita.fecha).toLocaleDateString('es-CO', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        })}</p>
        <p>🕐 {new Date(cita.fecha).toLocaleTimeString('es-CO', {
          hour: '2-digit', minute: '2-digit'
        })}</p>
        {cita.motivo && <p>📝 {cita.motivo}</p>}
      </div>

      {puedeCancel && (
        <button
          onClick={handleCancelar}
          disabled={cancelando}
          className="mt-4 text-sm text-red-600 hover:text-red-800 font-medium transition disabled:opacity-50"
        >
          {cancelando ? 'Cancelando...' : '✕ Cancelar cita'}
        </button>
      )}
    </div>
  );
};

export default AppointmentCard;
```

---

### `src/pages/CitasPage.jsx`

```jsx
import { useState, useEffect } from 'react';
import { Link }                 from 'react-router-dom';
import AppointmentCard          from '../components/appointments/AppointmentCard';
import { obtenerMisCitas }      from '../services/citasService';

const CitasPage = () => {
  const [citas, setCitas]       = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    obtenerMisCitas()
      .then(setCitas)
      .catch(() => setError('No se pudieron cargar tus citas'))
      .finally(() => setCargando(false));
  }, []);

  const handleCancelada = (idCita) => {
    setCitas(prev =>
      prev.map(c => c.id === idCita ? { ...c, estado: 'cancelada' } : c)
    );
  };

  if (cargando) return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-500 border-t-transparent" />
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary-700">Mis Citas Médicas</h1>
        <Link
          to="/citas/nueva"
          className="bg-primary-500 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          + Agendar nueva cita
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
          ⚠️ {error}
        </div>
      )}

      {citas.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <span className="text-5xl">📅</span>
          <p className="mt-4 text-lg">No tienes citas registradas</p>
          <Link to="/citas/nueva" className="mt-3 inline-block text-primary-500 hover:underline">
            Agenda tu primera cita
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {citas.map(cita => (
            <AppointmentCard
              key={cita.id}
              cita={cita}
              onCancelada={handleCancelada}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CitasPage;
```

---

### `src/pages/NuevaCitaPage.jsx`

```jsx
import { useReducer, useEffect, useState } from 'react';
import { useNavigate }                      from 'react-router-dom';
import { obtenerMedicos, agendarCita }      from '../services/citasService';

// ── Reducer para el flujo de agendamiento ────────────────────────────────
const initialState = { especialidad: '', medicoId: null, fecha: '', hora: '', motivo: '', paso: 1 };

function reducer(state, action) {
  switch (action.type) {
    case 'SET_ESPECIALIDAD': return { ...state, especialidad: action.payload, medicoId: null, paso: 2 };
    case 'SET_MEDICO':       return { ...state, medicoId: action.payload, paso: 3 };
    case 'SET_FECHA':        return { ...state, fecha: action.payload };
    case 'SET_HORA':         return { ...state, hora: action.payload };
    case 'SET_MOTIVO':       return { ...state, motivo: action.payload };
    case 'IR_CONFIRMAR':     return { ...state, paso: 4 };
    case 'RESET':            return initialState;
    default:                 return state;
  }
}

const ESPECIALIDADES = ['Medicina General','Cardiología','Pediatría','Ginecología','Dermatología','Ortopedia'];

const NuevaCitaPage = () => {
  const [state, dispatch]   = useReducer(reducer, initialState);
  const [medicos, setMedicos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError]   = useState('');
  const navigate             = useNavigate();

  // Cargar médicos cuando cambia la especialidad
  useEffect(() => {
    if (state.especialidad) {
      obtenerMedicos(state.especialidad).then(setMedicos);
    }
  }, [state.especialidad]);

  const handleAgendar = async () => {
    setError('');
    setCargando(true);
    try {
      const fechaHora = `${state.fecha}T${state.hora}:00`;
      await agendarCita({ medicoId: state.medicoId, fecha: fechaHora, motivo: state.motivo });
      navigate('/citas');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al agendar la cita');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-primary-700 mb-6">Agendar nueva cita</h1>

      {/* Paso 1 — Especialidad */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
        <h2 className="font-semibold text-gray-700 mb-3">1. Selecciona especialidad</h2>
        <div className="grid grid-cols-2 gap-2">
          {ESPECIALIDADES.map(esp => (
            <button
              key={esp}
              onClick={() => dispatch({ type: 'SET_ESPECIALIDAD', payload: esp })}
              className={`text-sm py-2 px-3 rounded-lg border transition ${
                state.especialidad === esp
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'border-gray-200 hover:border-primary-300'
              }`}
            >
              {esp}
            </button>
          ))}
        </div>
      </div>

      {/* Paso 2 — Médico */}
      {state.paso >= 2 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
          <h2 className="font-semibold text-gray-700 mb-3">2. Selecciona médico</h2>
          {medicos.length === 0 ? (
            <p className="text-gray-400 text-sm">No hay médicos disponibles para esta especialidad</p>
          ) : (
            <div className="space-y-2">
              {medicos.map(m => (
                <button
                  key={m.id}
                  onClick={() => dispatch({ type: 'SET_MEDICO', payload: m.id })}
                  className={`w-full text-left py-2 px-3 rounded-lg border transition ${
                    state.medicoId === m.id
                      ? 'bg-primary-500 text-white border-primary-500'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <span className="font-medium">{m.nombre}</span>
                  <span className="text-xs ml-2 opacity-70">{m.consultorio}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Paso 3 — Fecha, hora y motivo */}
      {state.paso >= 3 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4 space-y-4">
          <h2 className="font-semibold text-gray-700">3. Fecha y motivo</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">Fecha</label>
              <input type="date" value={state.fecha}
                onChange={e => dispatch({ type: 'SET_FECHA', payload: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">Hora</label>
              <input type="time" value={state.hora}
                onChange={e => dispatch({ type: 'SET_HORA', payload: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">Motivo de consulta</label>
            <textarea value={state.motivo}
              onChange={e => dispatch({ type: 'SET_MOTIVO', payload: e.target.value })}
              placeholder="Describe brevemente el motivo de tu consulta..."
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
              ⚠️ {error}
            </div>
          )}

          <button
            onClick={handleAgendar}
            disabled={!state.fecha || !state.hora || cargando}
            className="w-full bg-primary-500 hover:bg-primary-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
          >
            {cargando ? 'Agendando...' : '✅ Confirmar cita'}
          </button>
        </div>
      )}
    </div>
  );
};

export default NuevaCitaPage;
```

---

### `src/pages/DashboardPage.jsx`

```jsx
const DashboardPage = () => (
  <div>
    <h1 className="text-2xl font-bold text-primary-700 mb-4">Panel de Administración</h1>
    <div className="grid grid-cols-3 gap-4">
      {[
        { label: 'Citas hoy',          valor: '12', icon: '📅', color: 'bg-blue-50 text-blue-700' },
        { label: 'Médicos activos',     valor: '8',  icon: '👨‍⚕️', color: 'bg-green-50 text-green-700' },
        { label: 'Pacientes registrados', valor: '143', icon: '👥', color: 'bg-purple-50 text-purple-700' },
      ].map(({ label, valor, icon, color }) => (
        <div key={label} className={`rounded-xl p-6 ${color} border border-opacity-20`}>
          <span className="text-3xl">{icon}</span>
          <p className="text-3xl font-bold mt-2">{valor}</p>
          <p className="text-sm mt-1 opacity-80">{label}</p>
        </div>
      ))}
    </div>
  </div>
);

export default DashboardPage;
```

---

## 11. Hooks personalizados

### `src/hooks/useMedicos.js`

```javascript
import { useState, useEffect } from 'react';
import { obtenerMedicos }       from '../services/citasService';

const useMedicos = (especialidad) => {
  const [medicos, setMedicos]   = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError]       = useState(null);

  useEffect(() => {
    if (!especialidad) return;
    setCargando(true);
    obtenerMedicos(especialidad)
      .then(setMedicos)
      .catch(err => setError(err.message))
      .finally(() => setCargando(false));
  }, [especialidad]);

  return { medicos, cargando, error };
};

export default useMedicos;
```

---

## 12. Estilos con Tailwind CSS

Tailwind ya está configurado. Clases de uso frecuente en el proyecto:

| Clase | Efecto visual |
|-------|--------------|
| `bg-primary-500` | Fondo azul principal |
| `text-primary-700` | Texto azul oscuro |
| `rounded-xl` | Bordes redondeados |
| `shadow-sm` | Sombra suave |
| `transition` | Animaciones suaves |
| `hover:bg-primary-700` | Color al pasar el mouse |
| `disabled:opacity-50` | Transparencia al desactivar |
| `focus:ring-2` | Anillo de foco accesible |

---

## 13. Scripts disponibles

En el `package.json` de `/frontend` ya están incluidos por Vite:

```bash
# Modo desarrollo con recarga automática
npm run dev

# Compilar para producción (genera la carpeta /dist)
npm run build

# Previsualizar el build de producción
npm run preview
```

---

## 14. Conectar con el Backend

Para que el frontend se comunique con el backend necesitas tener **ambos servidores corriendo al mismo tiempo**:

```bash
# Terminal 1 — Backend
cd medicita-web/backend
npm run dev
# → http://localhost:4000

# Terminal 2 — Frontend
cd medicita-web/frontend
npm run dev
# → http://localhost:5173
```

> El archivo `.env.local` del frontend ya apunta a `http://localhost:4000/api`.  
> El archivo `.env` del backend ya permite CORS desde `http://localhost:5173`.

---

## 15. Subir a GitHub

```bash
# Desde la raíz medicita-web/
git add .
git commit -m "feat: frontend React MediCita Web - Login, Citas, Navegación"
git push origin main
```

Verifica que `.env.local` esté en `.gitignore` antes de hacer push. El archivo `.env.example` SÍ debe subirse.

---

## ✅ Checklist final

- [ ] Proyecto creado con `npm create vite@latest`
- [ ] Tailwind CSS instalado y configurado
- [ ] `react-router-dom` y `axios` instalados
- [ ] Archivo `.env.local` configurado con `VITE_API_URL`
- [ ] AuthContext envuelve toda la app en `main.jsx`... *(ya está en `App.jsx` con `<AuthProvider>`)*
- [ ] Backend corriendo en `http://localhost:4000`
- [ ] Frontend corriendo en `http://localhost:5173`
- [ ] Login funciona y guarda el token en localStorage
- [ ] Rutas protegidas redirigen al login si no hay sesión
- [ ] Repositorio subido a GitHub con `.env.local` excluido
