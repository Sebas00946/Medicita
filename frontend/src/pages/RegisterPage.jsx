import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registroApi } from '../services/authService';
import { Stethoscope, CheckCircle2, AlertCircle, User, Mail, Lock, UserPlus, LogIn } from 'lucide-react';

const RegisterPage = () => {
  const [form, setForm] = useState({ nombre: '', email: '', contrasena: '' });
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      await registroApi(form.nombre, form.email, form.contrasena);
      setExito(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrarse');
    } finally {
      setCargando(false);
    }
  };

  if (exito) return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md w-full">
        <CheckCircle2 className="w-20 h-20 mx-auto text-green-500 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Cuenta creada exitosamente!</h2>
        <p className="text-gray-500 mb-6">Redirigiendo al login...</p>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side - Decoración */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary-700 to-primary-900 p-12 flex-col justify-between">
          <div>
            <Stethoscope className="w-16 h-16 text-white mb-8" />
            <h2 className="text-3xl font-bold text-white mb-4">Crea tu cuenta</h2>
            <p className="text-primary-100 text-lg">
              Únete a MediCita Web y agenda tus citas médicas de forma rápida y sencilla.
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
            Regístrate
          </h1>
          <p className="text-gray-500 mb-8">
            Crea tu cuenta como paciente
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {[
              { label: 'Nombre completo', name: 'nombre',     type: 'text',     placeholder: 'Ana García', icon: <User className="w-5 h-5" /> },
              { label: 'Correo electrónico', name: 'email',   type: 'email',    placeholder: 'correo@ejemplo.com', icon: <Mail className="w-5 h-5" /> },
              { label: 'Contraseña',      name: 'contrasena', type: 'password', placeholder: '••••••••', icon: <Lock className="w-5 h-5" /> },
            ].map(({ label, name, type, placeholder, icon }) => (
              <div key={name}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {label}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {icon}
                  </span>
                  <input
                    type={type} 
                    name={name} 
                    value={form[name]}
                    onChange={handleChange} 
                    placeholder={placeholder} 
                    required
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white transition-all"
                  />
                </div>
              </div>
            ))}

            <button
              type="submit" 
              disabled={cargando}
              className="w-full bg-primary-500 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              {cargando ? 'Registrando...' : 'Crear cuenta'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-center text-sm text-gray-500">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-primary-500 font-semibold hover:text-primary-700 hover:underline inline-flex items-center gap-1">
                <LogIn className="w-4 h-4" />
                Ingresar
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
