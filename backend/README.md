# Backend - MediCita Web

API RESTful para el sistema de gestión de citas médicas.

## 🚀 Inicio rápido

### Con Docker (Recomendado)

```bash
# Desde la raíz del proyecto
docker-compose up -d --build
```

### Sin Docker (Desarrollo)

#### Prerrequisitos
- Node.js 20+
- PostgreSQL 16+

#### Pasos
1. Instalar dependencias:
```bash
cd backend
npm install
```

2. Configurar variables de entorno:
Copiar `.env.example` a `.env` y configurar

3. Iniciar servidor:
```bash
npm run dev
```

## 🔌 Endpoints principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Registrar nuevo usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/medicos` | Obtener médicos |
| POST | `/api/medicos` | Crear médico |
| GET | `/api/especialidades` | Obtener especialidades |
| GET | `/api/consultorios` | Obtener consultorios |
| GET | `/api/agendas/disponibles` | Obtener agendas disponibles |
| POST | `/api/citas` | Agendar cita |
| GET | `/api/reportes/estadisticas` | Estadísticas del sistema |
| GET | `/api/roles` | Obtener roles |
| GET | `/api/roles/:id/permisos` | Obtener permisos de un rol |

## 📚 Documentación API

Accede a la documentación completa en **Swagger UI**:
http://localhost:4000/api-docs

## 🗄️ Base de datos

### Credenciales (Docker)
- Host: `localhost`
- Puerto: `5432`
- Usuario: `medicita_user`
- Contraseña: `medicita_password`
- Base de datos: `medicita_db`

### Seeders iniciales
La base de datos se inicializa automáticamente con:
- Usuarios de prueba (admin, médicos, pacientes)
- Especialidades médicas
- Consultorios
- Agendas de médicos
- Citas de ejemplo

## 📝 Variables de entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|------------------|
| PORT | Puerto del servidor | 4000 |
| DB_HOST | Host de BD | db |
| DB_PORT | Puerto de BD | 5432 |
| DB_USER | Usuario de BD | medicita_user |
| DB_PASSWORD | Contraseña de BD | medicita_password |
| DB_NAME | Nombre de BD | medicita_db |
| JWT_SECRET | Secret para JWT | tu_secreto_super_seguro |

## 🔐 Seguridad

- JWT para autenticación
- Bcrypt para hashing de contraseñas
- Helmet para seguridad HTTP
- Rate limiting para prevenir abusos
- Sanitización de datos de entrada
- Consultas parametrizadas
