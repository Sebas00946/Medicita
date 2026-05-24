import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import PrivateRoute     from './components/layout/PrivateRoute';
import Navbar           from './components/layout/Navbar';
import AdminLayout      from './components/layout/AdminLayout';
import DoctorLayout     from './components/layout/DoctorLayout';

import LoginPage    from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CitasPage    from './pages/CitasPage';
import NuevaCitaPage from './pages/NuevaCitaPage';
import DashboardPage from './pages/DashboardPage';
import MedicosPage from './pages/admin/MedicosPage';
import ReportesPage from './pages/admin/ReportesPage';
import AgendasPage from './pages/admin/AgendasPage';
import CatalogosPage from './pages/admin/CatalogosPage';
import RolesPage from './pages/admin/RolesPage';

function AppContent() {
  const { usuario } = useAuth();

  const getLayout = (children) => {
    if (usuario?.rol === 'administrador') {
      return <AdminLayout>{children}</AdminLayout>;
    }
    if (usuario?.rol === 'medico') {
      return <DoctorLayout>{children}</DoctorLayout>;
    }
    return (
      <>
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 py-8">
          {children}
        </main>
      </>
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />

        {/* Rutas de Paciente */}
        <Route path="/citas" element={
          <PrivateRoute rolesPermitidos={['paciente']}>
            {getLayout(<CitasPage />)}
          </PrivateRoute>
        } />
        <Route path="/citas/nueva" element={
          <PrivateRoute rolesPermitidos={['paciente']}>
            {getLayout(<NuevaCitaPage />)}
          </PrivateRoute>
        } />

        {/* Rutas de Administrador */}
        <Route path="/admin/dashboard" element={
          <PrivateRoute rolesPermitidos={['administrador']}>
            <AdminLayout><DashboardPage /></AdminLayout>
          </PrivateRoute>
        } />
        <Route path="/admin/medicos" element={
          <PrivateRoute rolesPermitidos={['administrador']}>
            <AdminLayout><MedicosPage /></AdminLayout>
          </PrivateRoute>
        } />
        <Route path="/admin/agendas" element={
          <PrivateRoute rolesPermitidos={['administrador']}>
            <AdminLayout><AgendasPage /></AdminLayout>
          </PrivateRoute>
        } />
        <Route path="/admin/catalogos" element={
          <PrivateRoute rolesPermitidos={['administrador']}>
            <AdminLayout><CatalogosPage /></AdminLayout>
          </PrivateRoute>
        } />
        <Route path="/admin/reportes" element={
          <PrivateRoute rolesPermitidos={['administrador']}>
            <AdminLayout><ReportesPage /></AdminLayout>
          </PrivateRoute>
        } />
        <Route path="/admin/roles" element={
          <PrivateRoute rolesPermitidos={['administrador']}>
            <AdminLayout><RolesPage /></AdminLayout>
          </PrivateRoute>
        } />
        <Route path="/admin/configuracion" element={
          <PrivateRoute rolesPermitidos={['administrador']}>
            <AdminLayout>
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-800">Configuración</h2>
                <p className="text-gray-500 mt-2">Página en construcción</p>
              </div>
            </AdminLayout>
          </PrivateRoute>
        } />
        <Route path="/admin/citas" element={
          <PrivateRoute rolesPermitidos={['administrador']}>
            <AdminLayout>
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-800">Gestión de Citas</h2>
                <p className="text-gray-500 mt-2">Página en construcción</p>
              </div>
            </AdminLayout>
          </PrivateRoute>
        } />

        {/* Rutas de Médico */}
        <Route path="/medico/citas" element={
          <PrivateRoute rolesPermitidos={['medico']}>
            <DoctorLayout>
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-800">Mis Citas</h2>
                <p className="text-gray-500 mt-2">Página en construcción</p>
              </div>
            </DoctorLayout>
          </PrivateRoute>
        } />
        <Route path="/medico/disponibilidad" element={
          <PrivateRoute rolesPermitidos={['medico']}>
            <DoctorLayout>
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-800">Mi Disponibilidad</h2>
                <p className="text-gray-500 mt-2">Página en construcción</p>
              </div>
            </DoctorLayout>
          </PrivateRoute>
        } />
        <Route path="/medico/perfil" element={
          <PrivateRoute rolesPermitidos={['medico']}>
            <DoctorLayout>
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-800">Mi Perfil</h2>
                <p className="text-gray-500 mt-2">Página en construcción</p>
              </div>
            </DoctorLayout>
          </PrivateRoute>
        } />
        <Route path="/medico/reportes" element={
          <PrivateRoute rolesPermitidos={['medico']}>
            <DoctorLayout>
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-800">Mis Reportes</h2>
                <p className="text-gray-500 mt-2">Página en construcción</p>
              </div>
            </DoctorLayout>
          </PrivateRoute>
        } />

        {/* Redirección por defecto */}
        <Route path="/"   element={<Navigate to="/login" replace />} />
        <Route path="*"   element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
