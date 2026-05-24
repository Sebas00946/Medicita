# 🏥 MediCita Web — Backend Guide
> Node.js · Express · PostgreSQL · JWT · Swagger

---

## 📋 Tabla de Contenido

1. [Requisitos previos](#1-requisitos-previos)
2. [Crear el proyecto desde cero](#2-crear-el-proyecto-desde-cero)
3. [Estructura de carpetas](#3-estructura-de-carpetas)
4. [Variables de entorno](#4-variables-de-entorno)
5. [Base de datos — PostgreSQL](#5-base-de-datos--postgresql)
6. [Instalar dependencias](#6-instalar-dependencias)
7. [Archivos principales](#7-archivos-principales)
8. [Rutas de la API](#8-rutas-de-la-api)
9. [Autenticación JWT](#9-autenticación-jwt)
10. [Documentación Swagger](#10-documentación-swagger)
11. [Scripts disponibles](#11-scripts-disponibles)
12. [Subir a GitHub](#12-subir-a-github)

---

## 1. Requisitos previos

Antes de empezar instala estas herramientas en tu PC:

| Herramienta | Versión mínima | Descarga |
|-------------|---------------|---------|
| Node.js | 20.x LTS | https://nodejs.org |
| npm | 10.x (viene con Node) | — |
| PostgreSQL | 15.x | https://www.postgresql.org/download |
| Git | cualquiera | https://git-scm.com |

> **Verificar instalaciones:**
> ```bash
> node -v        # debe mostrar v20.x.x
> npm -v         # debe mostrar 10.x.x
> psql --version # debe mostrar PostgreSQL 15.x
> git --version  # debe mostrar git version x.x.x
> ```

---

## 2. Crear el proyecto desde cero

### Paso 1 — Crear la carpeta del proyecto

```bash
# Crea la carpeta raíz del proyecto completo
mkdir medicita-web
cd medicita-web

# Crea la subcarpeta del backend
mkdir backend
cd backend
```

### Paso 2 — Inicializar el proyecto Node.js

```bash
npm init -y
```

Esto crea el archivo `package.json`. Luego edítalo para agregar `"type": "module"` si quieres usar ES Modules, o déjalo como está para usar CommonJS (recomendado para comenzar).

### Paso 3 — Inicializar Git (desde la carpeta raíz)

```bash
# Vuelve a la carpeta raíz
cd ..

# Inicializar repositorio
git init

# Crear .gitignore global
cat > .gitignore << 'EOF'
node_modules/
.env
.env.local
.env.production
dist/
build/
*.log
.DS_Store
EOF
```

---

## 3. Estructura de carpetas

Crea exactamente esta estructura dentro de `/backend`:

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js            ← conexión a PostgreSQL
│   │   └── swagger.js       ← configuración Swagger
│   ├── middlewares/
│   │   ├── auth.js          ← verificar JWT
│   │   └── errorHandler.js  ← manejo global de errores
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.routes.js
│   │   │   ├── auth.controller.js
│   │   │   └── auth.service.js
│   │   ├── citas/
│   │   │   ├── citas.routes.js
│   │   │   ├── citas.controller.js
│   │   │   └── citas.service.js
│   │   ├── medicos/
│   │   │   ├── medicos.routes.js
│   │   │   ├── medicos.controller.js
│   │   │   └── medicos.service.js
│   │   └── usuarios/
│   │       ├── usuarios.routes.js
│   │       ├── usuarios.controller.js
│   │       └── usuarios.service.js
│   ├── database/
│   │   └── migrations.sql   ← esquema de la base de datos
│   └── server.js            ← punto de entrada
├── .env.example
├── .env                     ← NO subir a Git
└── package.json
```

### Crear las carpetas de una vez:

```bash
# Desde /backend
mkdir -p src/config
mkdir -p src/middlewares
mkdir -p src/modules/auth
mkdir -p src/modules/citas
mkdir -p src/modules/medicos
mkdir -p src/modules/usuarios
mkdir -p src/database
```

---

## 4. Variables de entorno

### Crear `.env.example` (este SÍ se sube a Git):

```bash
# Crea el archivo en /backend
cat > .env.example << 'EOF'
# Servidor
PORT=4000
NODE_ENV=development

# Base de datos PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=medicita_db
DB_USER=postgres
DB_PASSWORD=tu_contraseña_aqui

# JWT
JWT_SECRET=cambia_esto_por_un_secreto_muy_largo_y_seguro
JWT_EXPIRES_IN=8h

# CORS — URL del frontend
FRONTEND_URL=http://localhost:5173
EOF
```

### Crear `.env` (este NO se sube a Git):

```bash
cat > .env << 'EOF'
PORT=4000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=medicita_db
DB_USER=postgres
DB_PASSWORD=tu_contraseña_real
JWT_SECRET=MediCita2026_SuperSecretoJWT_CambiarEnProduccion
JWT_EXPIRES_IN=8h
FRONTEND_URL=http://localhost:5173
EOF
```

---

## 5. Base de datos — PostgreSQL

### Paso 1 — Crear la base de datos

Abre la terminal de PostgreSQL (`psql`) o pgAdmin y ejecuta:

```sql
CREATE DATABASE medicita_db;
```

### Paso 2 — Crear el archivo de migraciones

Crea el archivo `src/database/migrations.sql` con este contenido:

```sql
-- ============================================================
-- MediCita Web — Esquema de Base de Datos
-- ============================================================

-- Tabla de usuarios (base para pacientes y médicos)
CREATE TABLE IF NOT EXISTS usuarios (
  id          SERIAL PRIMARY KEY,
  nombre      VARCHAR(100) NOT NULL,
  email       VARCHAR(150) NOT NULL UNIQUE,
  contrasena  VARCHAR(255) NOT NULL,
  rol         VARCHAR(20)  NOT NULL DEFAULT 'paciente'
                           CHECK (rol IN ('paciente','medico','administrador')),
  activo      BOOLEAN      NOT NULL DEFAULT true,
  creado_en   TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Tabla de médicos (extiende usuarios)
CREATE TABLE IF NOT EXISTS medicos (
  id            SERIAL PRIMARY KEY,
  usuario_id    INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  especialidad  VARCHAR(100) NOT NULL,
  consultorio   VARCHAR(100),
  telefono      VARCHAR(20)
);

-- Tabla de pacientes (extiende usuarios)
CREATE TABLE IF NOT EXISTS pacientes (
  id                SERIAL PRIMARY KEY,
  usuario_id        INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  fecha_nacimiento  DATE,
  telefono          VARCHAR(20),
  documento         VARCHAR(30) UNIQUE
);

-- Tabla de disponibilidad de médicos
CREATE TABLE IF NOT EXISTS disponibilidad (
  id           SERIAL PRIMARY KEY,
  medico_id    INTEGER NOT NULL REFERENCES medicos(id) ON DELETE CASCADE,
  dia_semana   INTEGER NOT NULL CHECK (dia_semana BETWEEN 0 AND 6),
  hora_inicio  TIME NOT NULL,
  hora_fin     TIME NOT NULL
);

-- Tabla de citas
CREATE TABLE IF NOT EXISTS citas (
  id           SERIAL PRIMARY KEY,
  paciente_id  INTEGER NOT NULL REFERENCES pacientes(id),
  medico_id    INTEGER NOT NULL REFERENCES medicos(id),
  fecha        TIMESTAMP NOT NULL,
  motivo       VARCHAR(255),
  estado       VARCHAR(20) NOT NULL DEFAULT 'pendiente'
               CHECK (estado IN ('pendiente','confirmada','cancelada','completada')),
  creado_en    TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabla de notificaciones
CREATE TABLE IF NOT EXISTS notificaciones (
  id          SERIAL PRIMARY KEY,
  usuario_id  INTEGER NOT NULL REFERENCES usuarios(id),
  cita_id     INTEGER REFERENCES citas(id),
  tipo        VARCHAR(50) NOT NULL,
  mensaje     TEXT NOT NULL,
  leida       BOOLEAN NOT NULL DEFAULT false,
  creado_en   TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices para mejorar consultas frecuentes
CREATE INDEX IF NOT EXISTS idx_citas_paciente ON citas(paciente_id);
CREATE INDEX IF NOT EXISTS idx_citas_medico   ON citas(medico_id);
CREATE INDEX IF NOT EXISTS idx_citas_fecha    ON citas(fecha);
CREATE INDEX IF NOT EXISTS idx_citas_estado   ON citas(estado);

-- ============================================================
-- Datos iniciales de prueba
-- ============================================================

-- Contraseña para todos: Test1234! (hash bcrypt)
INSERT INTO usuarios (nombre, email, contrasena, rol) VALUES
  ('Admin MediCita',    'admin@medicita.com',   '$2b$10$example_hash_admin',   'administrador'),
  ('Dr. Carlos Ruiz',   'carlos@medicita.com',  '$2b$10$example_hash_medico',  'medico'),
  ('Ana García',        'ana@medicita.com',      '$2b$10$example_hash_paciente','paciente')
ON CONFLICT (email) DO NOTHING;
```

### Paso 3 — Ejecutar las migraciones

```bash
psql -U postgres -d medicita_db -f src/database/migrations.sql
```

---

## 6. Instalar dependencias

```bash
# Dependencias de producción
npm install express pg bcryptjs jsonwebtoken dotenv cors helmet morgan swagger-jsdoc swagger-ui-express express-validator

# Dependencias de desarrollo
npm install -D nodemon
```

### ¿Para qué sirve cada una?

| Paquete | Uso |
|---------|-----|
| `express` | Framework web principal |
| `pg` | Cliente PostgreSQL para Node.js |
| `bcryptjs` | Encriptar y verificar contraseñas |
| `jsonwebtoken` | Crear y verificar tokens JWT |
| `dotenv` | Leer variables de entorno del `.env` |
| `cors` | Permitir peticiones desde el frontend |
| `helmet` | Cabeceras de seguridad HTTP |
| `morgan` | Log de peticiones HTTP en consola |
| `swagger-jsdoc` | Generar documentación desde comentarios |
| `swagger-ui-express` | Interfaz visual de Swagger en `/api-docs` |
| `express-validator` | Validar datos de entrada |
| `nodemon` | Reiniciar servidor automáticamente al editar |

---

## 7. Archivos principales

### `src/config/db.js` — Conexión a PostgreSQL

```javascript
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Verificar conexión al iniciar
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Error conectando a PostgreSQL:', err.message);
  } else {
    console.log('✅ PostgreSQL conectado correctamente');
    release();
  }
});

module.exports = pool;
```

---

### `src/config/swagger.js` — Configuración Swagger

```javascript
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title:       'MediCita Web API',
      version:     '1.0.0',
      description: 'API REST para el sistema de agendamiento de citas médicas',
    },
    servers: [
      { url: 'http://localhost:4000', description: 'Desarrollo' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type:         'http',
          scheme:       'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  // Dónde buscar las anotaciones @openapi
  apis: ['./src/modules/**/*.routes.js'],
};

module.exports = swaggerJsdoc(options);
```

---

### `src/middlewares/auth.js` — Verificar JWT

```javascript
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario  = decoded; // { id, email, rol }
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

// Middleware de roles
const soloRol = (...roles) => (req, res, next) => {
  if (!roles.includes(req.usuario.rol)) {
    return res.status(403).json({ error: 'No tienes permisos para esta acción' });
  }
  next();
};

module.exports = { authMiddleware, soloRol };
```

---

### `src/middlewares/errorHandler.js` — Manejo de errores

```javascript
const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);

  const status  = err.status  || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(status).json({
    error:   message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
```

---

### `src/modules/auth/auth.service.js` — Lógica de autenticación

```javascript
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const pool   = require('../../config/db');

const registrar = async ({ nombre, email, contrasena }) => {
  // Verificar si el email ya existe
  const existe = await pool.query(
    'SELECT id FROM usuarios WHERE email = $1', [email]
  );
  if (existe.rows.length > 0) {
    const error = new Error('El email ya está registrado');
    error.status = 409;
    throw error;
  }

  const hash = await bcrypt.hash(contrasena, 10);
  const resultado = await pool.query(
    `INSERT INTO usuarios (nombre, email, contrasena, rol)
     VALUES ($1, $2, $3, 'paciente')
     RETURNING id, nombre, email, rol`,
    [nombre, email, hash]
  );

  return resultado.rows[0];
};

const login = async ({ email, contrasena }) => {
  const resultado = await pool.query(
    'SELECT * FROM usuarios WHERE email = $1 AND activo = true', [email]
  );
  const usuario = resultado.rows[0];

  if (!usuario) {
    const error = new Error('Credenciales inválidas');
    error.status = 401;
    throw error;
  }

  const passwordOk = await bcrypt.compare(contrasena, usuario.contrasena);
  if (!passwordOk) {
    const error = new Error('Credenciales inválidas');
    error.status = 401;
    throw error;
  }

  const token = jwt.sign(
    { id: usuario.id, email: usuario.email, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return {
    token,
    usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
  };
};

module.exports = { registrar, login };
```

---

### `src/modules/auth/auth.controller.js`

```javascript
const authService = require('./auth.service');

const registrar = async (req, res, next) => {
  try {
    const usuario = await authService.registrar(req.body);
    res.status(201).json({ mensaje: 'Usuario creado exitosamente', usuario });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const resultado = await authService.login(req.body);
    res.json(resultado);
  } catch (err) {
    next(err);
  }
};

module.exports = { registrar, login };
```

---

### `src/modules/auth/auth.routes.js`

```javascript
const { Router } = require('express');
const controller  = require('./auth.controller');
const router      = Router();

/**
 * @openapi
 * /api/auth/registro:
 *   post:
 *     summary: Registrar nuevo paciente
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, email, contrasena]
 *             properties:
 *               nombre:    { type: string, example: "Ana García" }
 *               email:     { type: string, example: "ana@correo.com" }
 *               contrasena:{ type: string, example: "MiClave123!" }
 *     responses:
 *       201: { description: Usuario creado }
 *       409: { description: Email ya registrado }
 */
router.post('/registro', controller.registrar);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, contrasena]
 *             properties:
 *               email:     { type: string }
 *               contrasena:{ type: string }
 *     responses:
 *       200: { description: Token JWT y datos del usuario }
 *       401: { description: Credenciales inválidas }
 */
router.post('/login', controller.login);

module.exports = router;
```

---

### `src/modules/citas/citas.service.js`

```javascript
const pool = require('../../config/db');

const obtenerMisCitas = async (usuarioId) => {
  const { rows } = await pool.query(
    `SELECT c.id, c.fecha, c.motivo, c.estado,
            u.nombre AS medico_nombre,
            m.especialidad
     FROM citas c
     JOIN pacientes p  ON c.paciente_id = p.id
     JOIN medicos  m   ON c.medico_id   = m.id
     JOIN usuarios u   ON m.usuario_id  = u.id
     WHERE p.usuario_id = $1
     ORDER BY c.fecha DESC`,
    [usuarioId]
  );
  return rows;
};

const crearCita = async ({ medicoId, fecha, motivo }, usuarioId) => {
  // Obtener paciente_id desde usuario_id
  const pac = await pool.query(
    'SELECT id FROM pacientes WHERE usuario_id = $1', [usuarioId]
  );
  if (!pac.rows.length) throw Object.assign(new Error('Perfil de paciente no encontrado'), { status: 404 });

  const { rows } = await pool.query(
    `INSERT INTO citas (paciente_id, medico_id, fecha, motivo)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [pac.rows[0].id, medicoId, fecha, motivo]
  );
  return rows[0];
};

const cancelarCita = async (citaId, usuarioId) => {
  const { rows } = await pool.query(
    `UPDATE citas SET estado = 'cancelada'
     WHERE id = $1
       AND paciente_id = (SELECT id FROM pacientes WHERE usuario_id = $2)
       AND estado NOT IN ('cancelada','completada')
     RETURNING *`,
    [citaId, usuarioId]
  );
  if (!rows.length) throw Object.assign(new Error('Cita no encontrada o no se puede cancelar'), { status: 404 });
  return rows[0];
};

module.exports = { obtenerMisCitas, crearCita, cancelarCita };
```

---

### `src/modules/citas/citas.controller.js`

```javascript
const service = require('./citas.service');

const obtenerMisCitas = async (req, res, next) => {
  try {
    const citas = await service.obtenerMisCitas(req.usuario.id);
    res.json(citas);
  } catch (err) { next(err); }
};

const crearCita = async (req, res, next) => {
  try {
    const cita = await service.crearCita(req.body, req.usuario.id);
    res.status(201).json(cita);
  } catch (err) { next(err); }
};

const cancelarCita = async (req, res, next) => {
  try {
    const cita = await service.cancelarCita(req.params.id, req.usuario.id);
    res.json(cita);
  } catch (err) { next(err); }
};

module.exports = { obtenerMisCitas, crearCita, cancelarCita };
```

---

### `src/modules/citas/citas.routes.js`

```javascript
const { Router }          = require('express');
const controller           = require('./citas.controller');
const { authMiddleware, soloRol } = require('../../middlewares/auth');
const router               = Router();

// Todas las rutas de citas requieren autenticación
router.use(authMiddleware);

/**
 * @openapi
 * /api/citas:
 *   get:
 *     summary: Obtener mis citas
 *     tags: [Citas]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista de citas del paciente }
 */
router.get('/', soloRol('paciente'), controller.obtenerMisCitas);

/**
 * @openapi
 * /api/citas:
 *   post:
 *     summary: Agendar nueva cita
 *     tags: [Citas]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [medicoId, fecha]
 *             properties:
 *               medicoId: { type: integer }
 *               fecha:    { type: string, format: date-time }
 *               motivo:   { type: string }
 *     responses:
 *       201: { description: Cita creada }
 */
router.post('/', soloRol('paciente'), controller.crearCita);

/**
 * @openapi
 * /api/citas/{id}/cancelar:
 *   patch:
 *     summary: Cancelar una cita
 *     tags: [Citas]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Cita cancelada }
 *       404: { description: Cita no encontrada }
 */
router.patch('/:id/cancelar', soloRol('paciente'), controller.cancelarCita);

module.exports = router;
```

---

### `src/modules/medicos/medicos.routes.js`

```javascript
const { Router }   = require('express');
const pool         = require('../../config/db');
const router       = Router();

/**
 * @openapi
 * /api/medicos:
 *   get:
 *     summary: Listar médicos (con filtro opcional por especialidad)
 *     tags: [Médicos]
 *     parameters:
 *       - in: query
 *         name: especialidad
 *         schema: { type: string }
 *     responses:
 *       200: { description: Lista de médicos }
 */
router.get('/', async (req, res, next) => {
  try {
    const { especialidad } = req.query;
    const query = especialidad
      ? `SELECT m.id, u.nombre, m.especialidad, m.consultorio
         FROM medicos m JOIN usuarios u ON m.usuario_id = u.id
         WHERE m.especialidad ILIKE $1 AND u.activo = true`
      : `SELECT m.id, u.nombre, m.especialidad, m.consultorio
         FROM medicos m JOIN usuarios u ON m.usuario_id = u.id
         WHERE u.activo = true`;

    const { rows } = await pool.query(query, especialidad ? [`%${especialidad}%`] : []);
    res.json(rows);
  } catch (err) { next(err); }
});

module.exports = router;
```

---

### `src/server.js` — Punto de entrada principal

```javascript
require('dotenv').config();
const express      = require('express');
const cors         = require('cors');
const helmet       = require('helmet');
const morgan       = require('morgan');
const swaggerUi    = require('swagger-ui-express');
const swaggerSpec  = require('./config/swagger');
const errorHandler = require('./middlewares/errorHandler');

// Rutas
const authRoutes    = require('./modules/auth/auth.routes');
const citasRoutes   = require('./modules/citas/citas.routes');
const medicosRoutes = require('./modules/medicos/medicos.routes');

const app  = express();
const PORT = process.env.PORT || 4000;

// ── Middlewares globales ──────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(morgan('dev'));
app.use(express.json());

// ── Documentación Swagger ─────────────────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ── Rutas de la API ───────────────────────────────────────────────────────
app.use('/api/auth',    authRoutes);
app.use('/api/citas',   citasRoutes);
app.use('/api/medicos', medicosRoutes);

// ── Ruta de salud ─────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ estado: 'ok', version: '1.0.0', proyecto: 'MediCita Web' });
});

// ── Manejo de errores (debe ir al final) ──────────────────────────────────
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Servidor MediCita Web corriendo en http://localhost:${PORT}`);
  console.log(`📖 Swagger UI disponible en http://localhost:${PORT}/api-docs`);
});
```

---

## 8. Rutas de la API

| Método | Ruta | Protegida | Descripción |
|--------|------|-----------|-------------|
| POST | `/api/auth/registro` | ❌ | Registrar nuevo paciente |
| POST | `/api/auth/login` | ❌ | Iniciar sesión — retorna JWT |
| GET | `/api/medicos` | ❌ | Listar médicos |
| GET | `/api/medicos?especialidad=x` | ❌ | Filtrar por especialidad |
| GET | `/api/citas` | ✅ paciente | Mis citas |
| POST | `/api/citas` | ✅ paciente | Agendar cita |
| PATCH | `/api/citas/:id/cancelar` | ✅ paciente | Cancelar cita |
| GET | `/api/health` | ❌ | Estado del servidor |
| GET | `/api-docs` | ❌ | Documentación Swagger UI |

---

## 9. Autenticación JWT

El flujo es:

```
1. POST /api/auth/login  →  el servidor valida credenciales y retorna { token, usuario }
2. El frontend guarda el token en localStorage
3. En cada petición protegida el frontend envía: Authorization: Bearer <token>
4. El middleware auth.js verifica el token y agrega req.usuario = { id, email, rol }
```

---

## 10. Documentación Swagger

Una vez levantado el servidor, abre en el navegador:

```
http://localhost:4000/api-docs
```

Desde ahí puedes:
- Ver todos los endpoints documentados
- Probar peticiones directamente
- Autenticarte con tu JWT (botón **Authorize**)

---

## 11. Scripts disponibles

Agrega estos scripts en tu `package.json`:

```json
{
  "scripts": {
    "start":   "node src/server.js",
    "dev":     "nodemon src/server.js",
    "migrate": "psql -U postgres -d medicita_db -f src/database/migrations.sql"
  }
}
```

### Comandos de uso diario:

```bash
# Levantar en modo desarrollo (se reinicia automáticamente)
npm run dev

# Levantar en modo producción
npm start

# Ejecutar migraciones de base de datos
npm run migrate
```

---

## 12. Subir a GitHub

```bash
# Desde la carpeta raíz del proyecto (medicita-web/)

# 1. Agregar todos los archivos (excepto los del .gitignore)
git add .

# 2. Primer commit
git commit -m "feat: backend inicial MediCita Web - Node.js/Express/PostgreSQL"

# 3. Crear el repositorio en github.com (interfaz web) y luego:
git remote add origin https://github.com/TU_USUARIO/medicita-web.git
git branch -M main
git push -u origin main
```

> ⚠️ **Importante:** Verifica que `.env` esté en `.gitignore` antes de hacer push. El archivo `.env.example` SÍ debe subirse.

---

## ✅ Checklist final

- [ ] PostgreSQL instalado y corriendo
- [ ] Base de datos `medicita_db` creada
- [ ] Migraciones ejecutadas (`npm run migrate`)
- [ ] Archivo `.env` configurado con tus datos reales
- [ ] Dependencias instaladas (`npm install`)
- [ ] Servidor corriendo (`npm run dev`)
- [ ] `http://localhost:4000/api/health` responde `{ estado: 'ok' }`
- [ ] `http://localhost:4000/api-docs` muestra Swagger UI
- [ ] Repositorio subido a GitHub
