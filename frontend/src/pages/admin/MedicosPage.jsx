import { useState, useEffect } from 'react';
import {
  obtenerMedicos,
  crearMedico,
  actualizarMedico,
  eliminarMedico
} from '../../services/medicosService';
import { obtenerEspecialidades } from '../../services/catalogosService';
import {
  Stethoscope,
  Edit,
  Trash2,
  UserPlus,
  Mail,
  Phone,
  AlertCircle,
  CheckCircle2,
  BadgeCheck
} from 'lucide-react';

const MedicosPage = () => {
  const [medicos, setMedicos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [medicoEditar, setMedicoEditar] = useState(null);
  const [especialidades, setEspecialidades] = useState([]);
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    contrasena: '',
    telefono: '',
    registro: '',
    especialidadIds: []
  });

  useEffect(() => {
    cargarMedicos();
    obtenerEspecialidades().then((items) => setEspecialidades(items.filter((item) => item.activa)));
  }, []);

  const cargarMedicos = async () => {
    try {
      setCargando(true);
      const data = await obtenerMedicos();
      setMedicos(data);
    } catch (err) {
      setError('Error al cargar los médicos');
    } finally {
      setCargando(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (medicoEditar) {
        await actualizarMedico(medicoEditar.id, form);
      } else {
        await crearMedico(form);
      }
      cerrarModal();
      cargarMedicos();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar el médico');
    }
  };

  const handleEditar = (medico) => {
    setMedicoEditar(medico);
    setForm({
      nombre: medico.nombre,
      email: medico.email,
      contrasena: '',
      telefono: medico.telefono || '',
      registro: medico.registro || '',
      especialidadIds: medico.especialidad_ids || []
    });
    setModalAbierto(true);
  };

  const handleEliminar = async (medico) => {
    if (!confirm(`¿Estás seguro de desactivar a ${medico.nombre}?`)) return;
    try {
      await eliminarMedico(medico.id);
      cargarMedicos();
    } catch (err) {
      setError('Error al desactivar el médico');
    }
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setMedicoEditar(null);
    setForm({
      nombre: '',
      email: '',
      contrasena: '',
      telefono: '',
      registro: '',
      especialidadIds: []
    });
  };

  const toggleEspecialidad = (id) => {
    setForm((prev) => {
      const yaSeleccionada = prev.especialidadIds.includes(id);
      
      if (yaSeleccionada) {
        return {
          ...prev,
          especialidadIds: prev.especialidadIds.filter((item) => item !== id)
        };
      }
      
      if (prev.especialidadIds.length >= 3) {
        alert('Solo se permiten máximo 3 especialidades por médico');
        return prev;
      }
      
      return {
        ...prev,
        especialidadIds: [...prev.especialidadIds, id]
      };
    });
  };

  if (cargando) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Stethoscope className="w-8 h-8 text-primary-500" />
            Gestión de Médicos
          </h1>
          <p className="text-gray-500 mt-1">Administra los profesionales de la salud</p>
        </div>
        <button
          onClick={() => setModalAbierto(true)}
          className="bg-primary-500 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition"
        >
          <UserPlus className="w-5 h-5" />
          Nuevo Médico
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Lista de Médicos */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {medicos.map((medico) => (
          <div key={medico.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-primary-500" />
                  {medico.nombre}
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {medico.especialidades?.map((especialidad) => (
                    <span
                      key={especialidad.id}
                      className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700"
                    >
                      <BadgeCheck className="w-3 h-3" />
                      {especialidad.nombre}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-sm text-gray-600">
              {medico.email && (
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {medico.email}
                </p>
              )}
              {medico.telefono && (
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {medico.telefono}
                </p>
              )}
              {medico.registro && (
                <p className="flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4" />
                  Registro: {medico.registro}
                </p>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex gap-2">
              <button
                onClick={() => handleEditar(medico)}
                className="flex-1 text-primary-600 hover:bg-primary-50 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition"
              >
                <Edit className="w-4 h-4" />
                Editar
              </button>
              <button
                onClick={() => handleEliminar(medico)}
                className="flex-1 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition"
              >
                <Trash2 className="w-4 h-4" />
                Desactivar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Nuevo/Editar Médico */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {medicoEditar ? 'Editar Médico' : 'Nuevo Médico'}
              </h2>
              <button
                onClick={cerrarModal}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {[
                { label: 'Nombre completo', name: 'nombre', type: 'text', required: true },
                { label: 'Correo electrónico', name: 'email', type: 'email', required: true },
                { label: 'Contraseña', name: 'contrasena', type: 'password', required: !medicoEditar },
              ].map(({ label, name, type, required }) => (
                <div key={name}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {label} {required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type={type}
                    name={name}
                    value={form[name]}
                    onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                    required={required}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white transition-all"
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Especialidades <span className="text-red-500">*</span>
                  <span className="ml-2 text-xs text-gray-500">
                    (Máximo 3)
                  </span>
                </label>
                <div className="mb-2 text-sm font-medium text-gray-600">
                  Seleccionadas: {form.especialidadIds.length}/3
                </div>
                <div className="grid grid-cols-2 gap-2 rounded-xl border border-gray-200 bg-gray-50 p-3">
                  {especialidades.map((esp) => {
                    const seleccionada = form.especialidadIds.includes(esp.id);
                    const deshabilitada = !seleccionada && form.especialidadIds.length >= 3;
                    
                    return (
                      <button
                        key={esp.id}
                        type="button"
                        onClick={() => toggleEspecialidad(esp.id)}
                        disabled={deshabilitada}
                        className={`rounded-lg border px-3 py-2 text-sm text-left transition ${
                          seleccionada
                            ? 'border-primary-500 bg-primary-500 text-white'
                            : deshabilitada
                            ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
                            : 'border-gray-200 bg-white hover:border-primary-300'
                        }`}
                      >
                        {esp.nombre}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono</label>
                  <input
                    type="text"
                    name="telefono"
                    value={form.telefono}
                    onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Registro profesional</label>
                  <input
                    type="text"
                    name="registro"
                    value={form.registro}
                    onChange={(e) => setForm({ ...form, registro: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="flex-1 border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary-500 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  {medicoEditar ? 'Guardar Cambios' : 'Crear Médico'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicosPage;
