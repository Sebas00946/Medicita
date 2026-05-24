import { useEffect, useState } from 'react';
import { CalendarDays, Clock3, MapPin, Plus, AlertCircle } from 'lucide-react';
import { obtenerAgendas, crearAgenda, eliminarAgenda } from '../../services/agendasService';
import { obtenerMedicos } from '../../services/medicosService';
import { obtenerConsultorios, obtenerEspecialidades } from '../../services/catalogosService';

const DIAS = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];

const AgendasPage = () => {
  const [agendas, setAgendas] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [consultorios, setConsultorios] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [error, setError] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [form, setForm] = useState({
    medicoId: '',
    especialidadId: '',
    consultorioId: '',
    diaSemana: 1,
    horaInicio: '08:00',
    horaFin: '12:00',
    duracionMinutos: 30,
  });

  const cargarTodo = async () => {
    try {
      const [agendasData, medicosData, consultoriosData, especialidadesData] = await Promise.all([
        obtenerAgendas(),
        obtenerMedicos(),
        obtenerConsultorios(),
        obtenerEspecialidades(),
      ]);
      setAgendas(agendasData);
      setMedicos(medicosData);
      setConsultorios(consultoriosData.filter((item) => item.activo));
      setEspecialidades(especialidadesData.filter((item) => item.activa));
    } catch {
      setError('No se pudo cargar la información de agendas');
    }
  };

  useEffect(() => {
    cargarTodo();
  }, []);

  const medicoSeleccionado = medicos.find((medico) => String(medico.id) === String(form.medicoId));
  const especialidadesDisponibles = medicoSeleccionado?.especialidades || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await crearAgenda({
        ...form,
        medicoId: Number(form.medicoId),
        especialidadId: Number(form.especialidadId),
        consultorioId: Number(form.consultorioId),
        diaSemana: Number(form.diaSemana),
        duracionMinutos: Number(form.duracionMinutos),
      });
      setModalAbierto(false);
      setForm({
        medicoId: '',
        especialidadId: '',
        consultorioId: '',
        diaSemana: 1,
        horaInicio: '08:00',
        horaFin: '12:00',
        duracionMinutos: 30,
      });
      cargarTodo();
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo crear la agenda');
    }
  };

  const handleEliminar = async (agenda) => {
    if (!confirm(`¿Deseas desactivar la agenda de ${agenda.medico_nombre}?`)) {
      return;
    }
    try {
      await eliminarAgenda(agenda.id);
      cargarTodo();
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo desactivar la agenda');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <CalendarDays className="w-8 h-8 text-primary-500" />
            Gestión de Agendas
          </h1>
          <p className="text-gray-500 mt-1">Relaciona médicos, especialidades y consultorios sin cruces de horario.</p>
        </div>
        <button
          onClick={() => setModalAbierto(true)}
          className="bg-primary-500 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition"
        >
          <Plus className="w-5 h-5" />
          Nueva agenda
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {agendas.map((agenda) => (
          <div key={agenda.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-lg font-semibold text-gray-900">{agenda.medico_nombre}</h3>
            <p className="text-sm text-primary-600 mt-1">{agenda.especialidad_nombre}</p>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {agenda.consultorio_nombre}
            </p>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
              <Clock3 className="w-4 h-4" />
              {DIAS[agenda.dia_semana]} · {agenda.hora_inicio.slice(0, 5)} - {agenda.hora_fin.slice(0, 5)} · {agenda.duracion_minutos} min
            </p>
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => handleEliminar(agenda)}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Desactivar agenda
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalAbierto && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Nueva agenda</h2>
                <button type="button" onClick={() => setModalAbierto(false)} className="text-gray-400 hover:text-gray-600">
                  X
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Médico</label>
                  <select
                    value={form.medicoId}
                    onChange={(e) => setForm({ ...form, medicoId: e.target.value, especialidadId: '' })}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50"
                  >
                    <option value="">Selecciona un médico</option>
                    {medicos.map((medico) => (
                      <option key={medico.id} value={medico.id}>{medico.nombre}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Especialidad</label>
                  <select
                    value={form.especialidadId}
                    onChange={(e) => setForm({ ...form, especialidadId: e.target.value })}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50"
                  >
                    <option value="">Selecciona una especialidad</option>
                    {especialidadesDisponibles.map((esp) => (
                      <option key={esp.id} value={esp.id}>{esp.nombre}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Consultorio</label>
                  <select
                    value={form.consultorioId}
                    onChange={(e) => setForm({ ...form, consultorioId: e.target.value })}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50"
                  >
                    <option value="">Selecciona un consultorio</option>
                    {consultorios.map((consultorio) => (
                      <option key={consultorio.id} value={consultorio.id}>{consultorio.nombre}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Día de la semana</label>
                  <select
                    value={form.diaSemana}
                    onChange={(e) => setForm({ ...form, diaSemana: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50"
                  >
                    {DIAS.map((dia, index) => (
                      <option key={dia} value={index}>{dia}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Hora inicio</label>
                  <input
                    type="time"
                    value={form.horaInicio}
                    onChange={(e) => setForm({ ...form, horaInicio: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Hora fin</label>
                  <input
                    type="time"
                    value={form.horaFin}
                    onChange={(e) => setForm({ ...form, horaFin: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Duración por bloque (minutos)</label>
                <select
                  value={form.duracionMinutos}
                  onChange={(e) => setForm({ ...form, duracionMinutos: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50"
                >
                  {[15, 20, 30, 45, 60].map((item) => (
                    <option key={item} value={item}>{item} minutos</option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="flex-1 border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary-500 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-semibold"
                >
                  Guardar agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgendasPage;
