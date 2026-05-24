import { useState } from 'react';
import { cancelarCita } from '../../services/citasService';
import { Clock, Calendar, FileText, X } from 'lucide-react';

const ESTADOS = {
  pendiente:  { color: 'bg-yellow-100 text-yellow-800',  label: 'Pendiente'  },
  confirmada: { color: 'bg-green-100  text-green-800',   label: 'Confirmada' },
  cancelada:  { color: 'bg-red-100    text-red-800',     label: 'Cancelada'  },
  completada: { color: 'bg-blue-100   text-blue-800',    label: 'Completada' },
};

const AppointmentCard = ({ cita, onCancelada }) => {
  const [cancelando, setCancelando] = useState(false);
  const estado = ESTADOS[cita.estado] || ESTADOS.pendiente;
  const puedeCancel = ['pendiente', 'confirmada'].includes(cita.estado);

  const handleCancelar = async () => {
    if (!confirm('¿Confirmas que deseas cancelar esta cita?')) return;
    setCancelando(true);
    try {
      await cancelarCita(cita.id);
      onCancelada?.(cita.id);
    } catch {
      alert('No se pudo cancelar la cita. Inténtalo de nuevo.');
    } finally {
      setCancelando(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-800">{cita.medico_nombre}</h3>
          <p className="text-primary-500 text-sm">{cita.especialidad}</p>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${estado.color}`}>
          {estado.label}
        </span>
      </div>

      <div className="mt-3 space-y-1 text-sm text-gray-600">
        <p className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          {new Date(cita.fecha).toLocaleDateString('es-CO', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
          })}
        </p>
        <p className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          {new Date(cita.fecha).toLocaleTimeString('es-CO', {
            hour: '2-digit', minute: '2-digit'
          })}
        </p>
        {cita.motivo && (
          <p className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            {cita.motivo}
          </p>
        )}
      </div>

      {puedeCancel && (
        <button
          onClick={handleCancelar}
          disabled={cancelando}
          className="mt-4 text-sm text-red-600 hover:text-red-800 font-medium transition disabled:opacity-50 flex items-center gap-1"
        >
          <X className="w-4 h-4" />
          {cancelando ? 'Cancelando...' : 'Cancelar cita'}
        </button>
      )}
    </div>
  );
};

export default AppointmentCard;
