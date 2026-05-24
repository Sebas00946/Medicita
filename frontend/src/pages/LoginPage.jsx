import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginApi } from '../services/authService';
import { Stethoscope, AlertCircle, Mail, Lock, LogIn, UserPlus } from 'lucide-react';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', contrasena: '' });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      const { token, usuario } = await loginApi(form.email, form.contrasena);
      login(usuario, token);
      navigate(usuario.rol === 'administrador' ? '/admin/dashboard' : '/citas');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side - Imagen/Decoración */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary-700 to-primary-900 p-12 flex-col justify-between">
          <div>
            <Stethoscope className="w-16 h-16 text-white mb-8" />
            <h2 className="text-3xl font-bold text-white mb-4">Bienvenido de nuevo</h2>
            <p className="text-primary-100 text-lg">
              Sistema de agendamiento de citas médicas.
            </p>
          </div>
          <div className="text-primary-100 text-sm">
            MediCita Web &copy; 2026
          </div>
        </div>

        {/* Right Side - Formulario */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="md:hidden flex justify-center mb-6">
            <Stethoscope className="w-12 h-12 text-primary-500" />
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Iniciar Sesión
          </h1>
          <p className="text-gray-500 mb-8">
            Ingresa con tu cuenta para continuar
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                  required
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="contrasena"
                  value={form.contrasena}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-primary-500 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              {cargando ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-center text-sm text-gray-500">
              ¿No tienes cuenta?{' '}
              <Link to="/registro" className="text-primary-500 font-semibold hover:text-primary-700 hover:underline inline-flex items-center gap-1">
                <UserPlus className="w-4 h-4" />
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
