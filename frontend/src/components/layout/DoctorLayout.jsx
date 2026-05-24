import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  CalendarDays,
  Clock,
  User,
  FileBarChart2,
  Settings,
  LogOut,
  Menu,
  X,
  Stethoscope
} from 'lucide-react';
import { useState } from 'react';

const DoctorLayout = ({ children }) => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      label: 'Mis Citas',
      path: '/medico/citas',
      icon: <CalendarDays className="w-5 h-5" />
    },
    {
      label: 'Mi Disponibilidad',
      path: '/medico/disponibilidad',
      icon: <Clock className="w-5 h-5" />
    },
    {
      label: 'Mi Perfil',
      path: '/medico/perfil',
      icon: <User className="w-5 h-5" />
    },
    {
      label: 'Reportes',
      path: '/medico/reportes',
      icon: <FileBarChart2 className="w-5 h-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`bg-green-900 text-white transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-6 border-b border-green-800 flex items-center justify-between">
          <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
            <Stethoscope className="w-8 h-8" />
            {sidebarOpen && (
              <span className="text-xl font-bold">MediCita</span>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-green-200 hover:text-white"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-green-700 text-white'
                    : 'text-green-200 hover:bg-green-800 hover:text-white'
                } ${!sidebarOpen && 'justify-center'}`}
              >
                {item.icon}
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">
            {menuItems.find(i => i.path === location.pathname)?.label || 'Mis Citas'}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 text-sm">
              Dr. {usuario?.nombre}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DoctorLayout;
