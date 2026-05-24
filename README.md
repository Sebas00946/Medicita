# MediCita Web - Sistema de Gestión de Citas Médicas

Sistema completo de gestión de citas médicas desarrollado con Node.js, PostgreSQL, React y Docker.

## 🚀 Características principales

### Backend
- API RESTful con Node.js y Express
- Base de datos PostgreSQL con Docker
- Autenticación JWT
- CRUD de Usuarios, Médicos, Especialidades, Consultorios, Agendas y Citas
- Roles y permisos
- Documentación con Swagger UI
- Seguridad: Helmet, rate limiting, sanitización de datos

### Frontend
- React 18 con Vite
- Tailwind CSS para estilos
- React Router para navegación
- Lucide React para íconos
- Recharts para gráficos
- Diseño responsive y profesional

## 📁 Estructura del proyecto

```
Medicita/
├── backend/          # API REST con Node.js
├── frontend/         # Aplicación React
├── docker-compose.yml # Orquestación Docker
└── README.md         # Este archivo
```

## 🔑 Credenciales de prueba

| Tipo | Email | Contraseña | Rol |
|------|-------|-----------|-----|
| Administrador | `admin@medicita.com` | `Medilaser2026*` | Administrador |
| Médico | `carlos@medicita.com` | `Test1234!` | Médico |
| Médico | `maria@medicita.com` | `Test1234!` | Médico |
| Paciente | `ana@medicita.com` | `Test1234!` | Paciente |
| Paciente | `luis@medicita.com` | `Test1234!` | Paciente |

## 🚀 Inicio rápido (Docker)

### Prerrequisitos
- Docker
- Docker Compose

### Ejecutar todo el sistema
```bash
docker-compose up -d --build
```

### Accesos
- **Backend API**: http://localhost:4000/api
- **Swagger UI**: http://localhost:4000/api-docs
- **Base de datos**: localhost:5432

## 📖 Documentación detallada

- [Backend - Guía de instalación y uso](./backend/README.md)
- [Frontend - Guía de instalación y uso](./frontend/README.md)

## 🛠️ Tecnologías utilizadas

### Backend
- Node.js 20
- Express.js
- PostgreSQL
- Docker
- JWT
- Bcrypt
- Helmet
- Rate Limit

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- Lucide React
- Recharts
- Axios

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.

## 👥 Autor

Sebastian Cabrera
