import { useState, useEffect } from 'react';
import { Link }                 from 'react-router-dom';
import AppointmentCard          from '../components/appointments/AppointmentCard';
import { obtenerMisCitas }      from '../services/citasService';
import { Calendar, Plus, AlertCircle, CalendarCheck } from 'lucide-react';

const CitasPage = () => {
  const [citas, setCitas]       = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    obtenerMisCitas()
      .then(setCitas)
      .catch(() => setError('No se pudieron cargar tus citas'))
      .finally(() => setCargando(false));
  }, []);

  const handleCancelada = (idCita) => {
    setCitas(prev =>
      prev.map(c => c.id === idCita ? { ...c, estado: 'cancelada' } : c)
    );
  };

  if (cargando) return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-500 border-t-transparent" />
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary-700 flex items-center gap-2">
          <Calendar className="w-7 h-7" />
          Mis Citas Médicas
        </h1>
        <Link
          to="/citas/nueva"
          className="bg-primary-500 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Agendar nueva cita
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {citas.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <CalendarCheck className="w-16 h-16 mx-auto opacity-50" />
          <p className="mt-4 text-lg">No tienes citas registradas</p>
          <Link to="/citas/nueva" className="mt-3 inline-block text-primary-500 hover:underline">
            Agenda tu primera cita
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {citas.map(cita => (
            <AppointmentCard
              key={cita.id}
              cita={cita}
              onCancelada={handleCancelada}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CitasPage;
