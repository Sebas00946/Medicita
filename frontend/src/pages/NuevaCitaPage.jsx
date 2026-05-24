import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  agendarCita,
  obtenerAgendasDisponibles,
  obtenerSugerenciasFechas,
  obtenerCitasRecientes
} from '../services/citasService';
import { obtenerEspecialidades } from '../services/catalogosService';
import { obtenerMedicos } from '../services/medicosService';
import {
  Calendar,
  Clock,
  FileText,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Stethoscope,
  User,
  CalendarDays,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const NuevaCitaPage = () => {
  const navigate = useNavigate();
  const [modoSeleccion, setModoSeleccion] = useState(null);
  const [especialidades, setEspecialidades] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [medicosFiltrados, setMedicosFiltrados] = useState([]);
  const [especialidadesFiltradas, setEspecialidadesFiltradas] = useState([]);
  const [especialidadId, setEspecialidadId] = useState('');
  const [medicoId, setMedicoId] = useState('');
  const [fecha, setFecha] = useState('');
  const [agendaId, setAgendaId] = useState(null);
  const [hora, setHora] = useState('');
  const [motivo, setMotivo] = useState('');
  const [cargando, setCargando] = useState(false);
  const [cargandoMedicos, setCargandoMedicos] = useState(false);
  const [cargandoAgendas, setCargandoAgendas] = useState(false);
  const [cargandoSugerencias, setCargandoSugerencias] = useState(false);
  const [cargandoRecientes, setCargandoRecientes] = useState(false);
  const [agendas, setAgendas] = useState([]);
  const [sugerencias, setSugerencias] = useState([]);
  const [citasRecientes, setCitasRecientes] = useState([]);
  const [error, setError] = useState('');
  const [paso, setPaso] = useState(0);

  useEffect(() => {
    Promise.all([
      obtenerEspecialidades(),
      obtenerMedicos()
    ])
      .then(([esps, meds]) => {
        setEspecialidades(esps.filter((item) => item.activa));
        setMedicos(meds);
      })
      .catch(() => setError('No se pudieron cargar los datos iniciales'));
    cargarCitasRecientes();
  }, []);

  useEffect(() => {
    if (modoSeleccion === 'especialidad' && especialidadId) {
      filtrarMedicosPorEspecialidad();
    } else if (modoSeleccion === 'medico' && medicoId) {
      filtrarEspecialidadesPorMedico();
    }
  }, [modoSeleccion, especialidadId, medicoId]);

  const cargarCitasRecientes = async () => {
    try {
      setCargandoRecientes(true);
      const citas = await obtenerCitasRecientes(5);
      setCitasRecientes(citas);
    } catch (err) {
      console.error('Error al cargar citas recientes:', err);
    } finally {
      setCargandoRecientes(false);
    }
  };

  const filtrarMedicosPorEspecialidad = async () => {
    if (!especialidadId) return;
    try {
      setCargandoMedicos(true);
      const meds = await obtenerMedicos(especialidadId);
      setMedicosFiltrados(meds);
    } catch (err) {
      setError('No se pudieron cargar los médicos');
    } finally {
      setCargandoMedicos(false);
    }
  };

  const filtrarEspecialidadesPorMedico = () => {
    if (!medicoId) return;
    const medico = medicos.find(m => m.id === parseInt(medicoId));
    if (medico) {
      setEspecialidadesFiltradas(medico.especialidades || []);
    }
  };

  const cargarAgendas = async () => {
    if (modoSeleccion === 'especialidad') {
      if (!especialidadId || !medicoId || !fecha) return;
    } else {
      if (!medicoId || !especialidadId || !fecha) return;
    }

    setCargandoAgendas(true);
    setError('');
    try {
      const items = await obtenerAgendasDisponibles({
        especialidadId,
        fecha
      });
      
      const filtro = items.filter(a => 
        modoSeleccion === 'especialidad' ? a.medico_id === parseInt(medicoId) : a.medico_id === parseInt(medicoId)
      );
      
      setAgendas(filtro);
      setAgendaId(null);
      setHora('');
      
      if (filtro.length === 0) {
        cargarSugerencias();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudieron cargar las agendas disponibles');
      cargarSugerencias();
    } finally {
      setCargandoAgendas(false);
    }
  };

  const cargarSugerencias = async () => {
    try {
      setCargandoSugerencias(true);
      const fechas = await obtenerSugerenciasFechas({
        especialidadId,
        medicoId
      });
      setSugerencias(fechas);
    } catch (err) {
      console.error('Error al cargar sugerencias:', err);
    } finally {
      setCargandoSugerencias(false);
    }
  };

  const handleAgendar = async () => {
    if (!agendaId || !hora || !fecha) {
      return;
    }

    setError('');
    setCargando(true);
    try {
      await agendarCita({
        agendaId,
        fecha: `${fecha}T${hora}:00`,
        motivo,
      });
      navigate('/citas');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al agendar la cita');
    } finally {
      setCargando(false);
    }
  };

  const reiniciar = () => {
    setModoSeleccion(null);
    setEspecialidadId('');
    setMedicoId('');
    setFecha('');
    setAgendaId(null);
    setHora('');
    setMotivo('');
    setAgendas([]);
    setSugerencias([]);
    setPaso(0);
    setError('');
  };

  const puedeAvanzar = () => {
    switch (paso) {
      case 0: return !!modoSeleccion;
      case 1: return modoSeleccion === 'especialidad' ? !!especialidadId : !!medicoId;
      case 2: return modoSeleccion === 'especialidad' ? !!medicoId : !!especialidadId;
      case 3: return !!fecha;
      case 4: return !!hora && !!agendaId;
      default: return false;
    }
  };

  const avanzar = () => {
    if (!puedeAvanzar()) return;
    
    if (paso === 3 && fecha) {
      cargarAgendas();
    }
    
    setPaso(p => p + 1);
  };

  const retroceder = () => {
    setPaso(p => Math.max(0, p - 1));
  };

  const agendaSeleccionada = agendas.find((agenda) => agenda.id === agendaId);
  const getColorEstado = (estado) => {
    switch (estado) {
      case 'confirmada': return 'bg-blue-100 text-blue-700';
      case 'pendiente': return 'bg-yellow-100 text-yellow-700';
      case 'completada': return 'bg-green-100 text-green-700';
      case 'cancelada': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const totalPasos = 6;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header compacto */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary-500" />
                Agendar nueva cita
              </h1>
            </div>
            <button
              onClick={reiniciar}
              className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-100 transition"
            >
              Reiniciar
            </button>
          </div>

          {/* Barra de progreso compacta */}
          <div className="mt-4">
            <div className="flex items-center gap-2">
              {[0, 1, 2, 3, 4, 5].map((p) => (
                <div key={p} className="flex items-center gap-1 flex-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-semibold text-xs transition-all ${
                    paso > p ? 'bg-green-500 text-white' :
                    paso === p ? 'bg-primary-500 text-white scale-105 ring-2 ring-primary-100' :
                    'bg-gray-200 text-gray-500'
                  }`}>
                    {paso > p ? <CheckCircle2 className="w-4 h-4" /> : p + 1}
                  </div>
                  {p < 5 && (
                    <div className={`flex-1 h-0.5 rounded ${
                      paso > p ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 grid lg:grid-cols-4 gap-4">
        {/* Contenido principal compacto */}
        <div className="lg:col-span-3">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-3 py-2 mb-4 flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
              <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 min-h-[380px]">
            {/* Paso 0: Modo de selección */}
            {paso === 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4 text-center">¿Cómo deseas agendar tu cita?</h2>
                <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <button
                    onClick={() => {
                      setModoSeleccion('especialidad');
                      setTimeout(() => setPaso(1), 200);
                    }}
                    className={`p-5 border-2 rounded-xl transition group text-left ${
                      modoSeleccion === 'especialidad'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-dashed border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                    }`}
                  >
                    <Stethoscope className={`w-8 h-8 mb-2 ${
                      modoSeleccion === 'especialidad' ? 'text-primary-500' : 'text-gray-400 group-hover:text-primary-500'
                    }`} />
                    <h3 className="text-base font-bold text-gray-900 mb-1">Por Especialidad</h3>
                    <p className="text-xs text-gray-500">
                      Selecciona la especialidad y luego el médico.
                    </p>
                  </button>

                  <button
                    onClick={() => {
                      setModoSeleccion('medico');
                      setTimeout(() => setPaso(1), 200);
                    }}
                    className={`p-5 border-2 rounded-xl transition group text-left ${
                      modoSeleccion === 'medico'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-dashed border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                    }`}
                  >
                    <User className={`w-8 h-8 mb-2 ${
                      modoSeleccion === 'medico' ? 'text-primary-500' : 'text-gray-400 group-hover:text-primary-500'
                    }`} />
                    <h3 className="text-base font-bold text-gray-900 mb-1">Por Médico</h3>
                    <p className="text-xs text-gray-500">
                      Selecciona directamente al médico.
                    </p>
                  </button>
                </div>
              </div>
            )}

            {/* Paso 1: Primera selección */}
            {paso === 1 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4 text-center">
                  {modoSeleccion === 'especialidad' ? 'Selecciona la especialidad' : 'Selecciona el médico'}
                </h2>
                <div className="max-w-xl mx-auto">
                  {modoSeleccion === 'especialidad' ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {especialidades.map((esp) => (
                        <button
                          key={esp.id}
                          onClick={async () => {
                            setEspecialidadId(String(esp.id));
                            if (modoSeleccion === 'especialidad') {
                              setCargandoMedicos(true);
                              const meds = await obtenerMedicos(String(esp.id));
                              setMedicosFiltrados(meds);
                              setCargandoMedicos(false);
                              if (meds.length > 0) {
                                setTimeout(() => setPaso(2), 200);
                              }
                            }
                          }}
                          className={`text-xs py-3 px-3 rounded-lg border transition ${
                            String(especialidadId) === String(esp.id)
                              ? 'bg-primary-500 text-white border-primary-500'
                              : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                          }`}
                        >
                          {esp.nombre}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-2">
                      {medicos.map((med) => (
                        <button
                          key={med.id}
                          onClick={() => {
                            setMedicoId(String(med.id));
                            if (modoSeleccion === 'medico') {
                              setTimeout(() => setPaso(2), 200);
                            }
                          }}
                          className={`text-xs py-3 px-3 rounded-lg border transition flex items-center gap-2 ${
                            String(medicoId) === String(med.id)
                              ? 'bg-primary-500 text-white border-primary-500'
                              : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                          }`}
                        >
                          <User className="w-4 h-4" />
                          {med.nombre}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Paso 2: Segunda selección */}
            {paso === 2 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4 text-center">
                  {modoSeleccion === 'especialidad' ? 'Selecciona el médico' : 'Selecciona la especialidad'}
                </h2>
                <div className="max-w-xl mx-auto">
                  {modoSeleccion === 'especialidad' ? (
                    cargandoMedicos ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-3 border-primary-500 border-t-transparent" />
                      </div>
                    ) : (
                      <div className="grid sm:grid-cols-2 gap-2">
                        {medicosFiltrados.map((med) => (
                          <button
                            key={med.id}
                            onClick={() => {
                              setMedicoId(String(med.id));
                              setTimeout(() => setPaso(3), 200);
                            }}
                            className={`text-xs py-3 px-3 rounded-lg border transition flex items-center gap-2 ${
                              String(medicoId) === String(med.id)
                                ? 'bg-primary-500 text-white border-primary-500'
                                : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                            }`}
                          >
                            <User className="w-4 h-4" />
                            {med.nombre}
                          </button>
                        ))}
                      </div>
                    )
                  ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {especialidadesFiltradas.map((esp) => (
                        <button
                          key={esp.id}
                          onClick={() => {
                            setEspecialidadId(String(esp.id));
                            setTimeout(() => setPaso(3), 200);
                          }}
                          className={`text-xs py-3 px-3 rounded-lg border transition ${
                            String(especialidadId) === String(esp.id)
                              ? 'bg-primary-500 text-white border-primary-500'
                              : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                          }`}
                        >
                          {esp.nombre}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Paso 3: Fecha */}
            {paso === 3 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4 text-center flex items-center justify-center gap-2">
                  <CalendarDays className="w-5 h-5" />
                  Selecciona la fecha
                </h2>
                <div className="max-w-xs mx-auto text-center">
                  <input
                    type="date"
                    value={fecha}
                    onChange={async (e) => {
                      setFecha(e.target.value);
                      setAgendas([]);
                      setSugerencias([]);
                      if (e.target.value) {
                        setCargandoAgendas(true);
                        setError('');
                        try {
                          const items = await obtenerAgendasDisponibles({
                            especialidadId,
                            fecha: e.target.value
                          });
                          const filtro = items.filter(a => 
                            modoSeleccion === 'especialidad' ? a.medico_id === parseInt(medicoId) : a.medico_id === parseInt(medicoId)
                          );
                          setAgendas(filtro);
                          setAgendaId(null);
                          setHora('');
                          
                          if (filtro.length === 0) {
                            const fechas = await obtenerSugerenciasFechas({
                              especialidadId,
                              medicoId
                            });
                            setSugerencias(fechas);
                          } else {
                            setTimeout(() => setPaso(4), 200);
                          }
                        } catch (err) {
                          setError(err.response?.data?.error || 'No se pudieron cargar las agendas');
                          const fechas = await obtenerSugerenciasFechas({
                            especialidadId,
                            medicoId
                          });
                          setSugerencias(fechas);
                        } finally {
                          setCargandoAgendas(false);
                        }
                      }
                    }}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full text-sm border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />

                  {sugerencias.length > 0 && !agendas.length && (
                    <div className="mt-4">
                      <h3 className="text-xs font-semibold text-gray-700 mb-2 flex items-center justify-center gap-1">
                        <Sparkles className="w-3 h-3 text-yellow-500" />
                        Fechas disponibles próximas:
                      </h3>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {sugerencias.map((sug) => (
                          <button
                            key={sug.fecha}
                            onClick={() => {
                              setFecha(sug.fecha);
                              setAgendas(sug.agendas);
                              setSugerencias([]);
                              setAgendaId(null);
                              setHora('');
                            }}
                            className="px-3 py-1.5 border border-green-200 bg-green-50 text-green-700 rounded-lg text-xs hover:bg-green-100 transition font-medium"
                          >
                            {new Date(sug.fecha + 'T00:00:00').toLocaleDateString('es-ES', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short'
                            })}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Paso 4: Hora */}
            {paso === 4 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4 text-center">Selecciona la hora</h2>
                {cargandoAgendas ? (
                  <div className="flex justify-center py-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-3 border-primary-500 border-t-transparent" />
                  </div>
                ) : (
                  <div className="grid gap-3 md:grid-cols-2 max-w-3xl mx-auto">
                    {agendas.map((agenda) => (
                      <div
                        key={agenda.id}
                        className={`rounded-xl border-2 p-4 transition ${
                          agendaId === agenda.id
                            ? 'border-primary-500 ring-2 ring-primary-100 bg-white'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="mb-3">
                          <h3 className="font-semibold text-gray-900 flex items-center gap-1.5 text-sm">
                            <Stethoscope className="w-4 h-4 text-primary-500" />
                            {agenda.medico_nombre}
                          </h3>
                          <p className="text-xs text-primary-600 mt-0.5">{agenda.especialidad_nombre}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" />
                            {agenda.consultorio_nombre}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {agenda.hora_inicio.slice(0, 5)} - {agenda.hora_fin.slice(0, 5)}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] font-semibold text-gray-500 mb-1.5">Horarios disponibles</p>
                          <div className="flex flex-wrap gap-1.5">
                            {agenda.slots.map((slot) => (
                              <button
                                key={`${agenda.id}-${slot}`}
                                onClick={() => {
                                  setAgendaId(agenda.id);
                                  setHora(slot);
                                  setTimeout(() => setPaso(5), 200);
                                }}
                                className={`px-2.5 py-1.5 rounded-lg text-xs border-2 transition font-medium ${
                                  agendaId === agenda.id && hora === slot
                                    ? 'bg-primary-500 border-primary-500 text-white'
                                    : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                                }`}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Paso 5: Confirmación */}
            {paso === 5 && agendaSeleccionada && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4 text-center">Confirmación de la cita</h2>
                <div className="max-w-md mx-auto space-y-4">
                  <div className="rounded-xl bg-primary-50 border-2 border-primary-100 p-4">
                    <h3 className="font-semibold text-primary-900 mb-3 text-sm">Resumen de la cita:</h3>
                    <div className="space-y-1.5 text-xs text-primary-800">
                      <p className="flex justify-between"><span className="font-medium">Médico:</span> {agendaSeleccionada.medico_nombre}</p>
                      <p className="flex justify-between"><span className="font-medium">Especialidad:</span> {agendaSeleccionada.especialidad_nombre}</p>
                      <p className="flex justify-between"><span className="font-medium">Consultorio:</span> {agendaSeleccionada.consultorio_nombre}</p>
                      <p className="flex justify-between"><span className="font-medium">Fecha y hora:</span> {new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })} {hora}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1.5 flex items-center gap-1.5">
                      <FileText className="w-4 h-4" />
                      Motivo de consulta
                    </label>
                    <textarea
                      value={motivo}
                      onChange={(e) => setMotivo(e.target.value)}
                      placeholder="Describe brevemente el motivo..."
                      rows={3}
                      className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <button
                    onClick={handleAgendar}
                    disabled={!agendaId || !hora || cargando}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                  >
                    {cargando ? 'Agendando...' : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Confirmar y Agendar Cita
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Botones de navegación compactos */}
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={retroceder}
              disabled={paso === 0}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition flex items-center gap-2 ${
                paso === 0
                  ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400'
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Atrás
            </button>
            
            {paso < totalPasos - 1 && puedeAvanzar() && (
              <button
                onClick={avanzar}
                className="px-5 py-2.5 bg-primary-500 hover:bg-primary-700 text-white rounded-xl font-semibold text-sm transition flex items-center gap-2 shadow-md shadow-primary-200"
              >
                Siguiente
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Sidebar compacto */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-24">
            <h2 className="text-sm font-bold text-gray-900 mb-3">Citas recientes</h2>
            {cargandoRecientes ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-500 border-t-transparent" />
              </div>
            ) : citasRecientes.length === 0 ? (
              <p className="text-gray-500 text-xs">No hay citas recientes</p>
            ) : (
              <div className="space-y-2.5">
                {citasRecientes.map((cita) => (
                  <div key={cita.id} className="p-2.5 rounded-xl border border-gray-100 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-900">{cita.paciente_nombre}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium capitalize ${getColorEstado(cita.estado)}`}>
                        {cita.estado}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-600 mt-0.5">
                      Dr. {cita.medico_nombre} · {cita.especialidad_nombre}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      {new Date(cita.fecha).toLocaleString('es-ES', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NuevaCitaPage;
