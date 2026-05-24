import { Link, useNavigate } from 'react-router-dom';
import { useAuth }           from '../../context/AuthContext';
import { Stethoscope, LogOut, UserPlus, User, Calendar, Plus, Home } from 'lucide-react';

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
        <Link to="/" className="text-xl font-bold tracking-wide flex items-center gap-2">
          <Stethoscope className="w-6 h-6" />
          MediCita Web
        </Link>

        <div className="flex items-center gap-4">
          {estaAutenticado ? (
            <>
              {usuario.rol === 'paciente' && (
                <>
                  <Link to="/citas" className="hover:text-primary-100 transition flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Mis Citas
                  </Link>
                  <Link to="/citas/nueva" className="hover:text-primary-100 transition flex items-center gap-1">
                    <Plus className="w-4 h-4" />
                    Agendar
                  </Link>
                </>
              )}
              {usuario.rol === 'administrador' && (
                <Link to="/admin/dashboard" className="hover:text-primary-100 transition flex items-center gap-1">
                  <Home className="w-4 h-4" />
                  Dashboard
                </Link>
              )}
              <span className="text-primary-100 text-sm flex items-center gap-1">
                <User className="w-4 h-4" />
                Hola, {usuario.nombre}
              </span>
              <button
                onClick={handleLogout}
                className="bg-white text-primary-700 px-3 py-1 rounded text-sm font-medium hover:bg-primary-100 transition flex items-center gap-1"
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-primary-100 transition">Ingresar</Link>
              <Link to="/registro" className="bg-white text-primary-700 px-3 py-1 rounded text-sm font-medium hover:bg-primary-100 transition flex items-center gap-1">
                <UserPlus className="w-4 h-4" />
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
