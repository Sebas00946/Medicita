# Historial de Cambios - Backend MediCita Web

## Versión 1.1.0 - 23/05/2026

### Nuevas Funcionalidades
- ✅ **CRUD completo de Médicos**: Endpoints para crear, editar, listar y desactivar médicos
- ✅ **Perfil de paciente automático**: Se crea automáticamente al registrar un nuevo usuario
- ✅ **Contraseña de Admin actualizada**: `admin@medicita.com` / `Medilaser2026*`

### Endpoints Nuevos
- `GET /api/medicos` - Listar médicos (con filtro opcional por especialidad)
- `GET /api/medicos/:id` - Obtener médico por ID
- `POST /api/medicos` - Crear nuevo médico (solo admin)
- `PUT /api/medicos/:id` - Actualizar médico (solo admin)
- `DELETE /api/medicos/:id` - Desactivar médico (solo admin)

### Mejoras
- Swagger UI actualizado con la nueva documentación
- Manejo de errores mejorado
- Consultas parametrizadas para seguridad

---

## Versión 1.0.0 - 23/05/2026

### Funcionalidades Iniciales
- Autenticación con JWT
- Gestión de citas (listar, agendar, cancelar)
- Gestión de usuarios básica
- Base de datos PostgreSQL
- Dockerización completa
- Swagger UI para documentación
