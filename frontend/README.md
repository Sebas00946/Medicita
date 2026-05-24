# Frontend - MediCita Web

Aplicación web React para el sistema de gestión de citas médicas.

## 🚀 Inicio rápido

### Con Docker

El frontend se ejecuta separadamente del backend.

### Sin Docker (Desarrollo)

#### Prerrequisitos
- Node.js 20+
- npm o yarn

#### Pasos

1. Instalar dependencias:
```bash
cd frontend
npm install
```

2. Iniciar servidor de desarrollo:
```bash
npm run dev
```

3. Acceder a la aplicación:
http://localhost:5173

## 📱 Páginas principales

| Ruta | Descripción |
|------|-------------|
| `/` | Inicio |
| `/login` | Inicio de sesión |
| `/register` | Registro de usuario |
| `/citas` | Ver citas del usuario |
| `/citas/nueva` | Agendar nueva cita |
| `/admin/medicos` | Gestión de médicos |
| `/admin/catalogos` | Catálogos (especialidades, consultorios) |
| `/admin/reportes` | Reportes y gráficos |
| `/admin/roles` | Gestión de roles y permisos |

## 🎨 Características

### Layouts
- **AdminLayout**: Sidebar para administrador
- **DoctorLayout**: Sidebar para médicos
- Layout simple para pacientes

### Funcionalidades
- Wizard de agendamiento de citas
- Múltiples especialidades por médico
- Sugerencias de fechas disponibles
- Reportes con gráficos (Recharts)
- Gestión de roles y permisos
- Diseño responsive
- Interfaz moderna y intuitiva

## 🛠️ Tecnologías

- React 18
- Vite
- Tailwind CSS
- React Router
- Lucide React (íconos)
- Recharts (gráficos)
- Axios

## 🔧 Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Iniciar servidor de desarrollo |
| `npm run build` | Construir para producción |
| `npm run preview` | Previsualizar build |

## 📝 Variables de entorno

Crear archivo `.env` en la carpeta `frontend/`:

```env
VITE_API_URL=http://localhost:4000/api
```

## 🔗 Integración con Backend

La aplicación se conecta al backend en:
- **API URL**: http://localhost:4000/api

Asegúrate de que el backend esté corriendo antes de usar el frontend.

## 📱 Responsive Design

El diseño es completamente responsive y funciona en:
- Desktop (1280px+)
- Tablet (768px - 1279px)
- Mobile (<768px)

## 🎯 Funcionalidades destacadas

1. **Wizard de citas**: Flujo paso a paso para agendar
2. **Doble modo de selección**: Por especialidad o por médico
3. **Sugerencias de fechas**: Si no hay disponibilidad, muestra fechas próximas
4. **Roles y permisos**: Gestión completa de accesos
5. **Reportes gráficos**: Estadísticas visuales con Recharts
6. **Navegación inteligente**: Layout automático según el rol
