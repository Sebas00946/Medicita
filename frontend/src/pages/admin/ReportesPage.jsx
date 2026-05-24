import { useState, useEffect } from 'react';
import {
  FileBarChart2,
  Calendar,
  Users,
  Stethoscope,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  obtenerEstadisticas,
  obtenerCitasPorMes,
  obtenerCitasPorEspecialidad
} from '../../services/reportesService';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const ReportesPage = () => {
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [estadisticas, setEstadisticas] = useState(null);
  const [citasPorMes, setCitasPorMes] = useState([]);
  const [citasPorEspecialidad, setCitasPorEspecialidad] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const [stats, porMes, porEspecialidad] = await Promise.all([
        obtenerEstadisticas(),
        obtenerCitasPorMes(),
        obtenerCitasPorEspecialidad()
      ]);
      setEstadisticas(stats);
      setCitasPorMes(porMes);
      setCitasPorEspecialidad(porEspecialidad);
    } catch (err) {
      setError('Error al cargar los reportes');
    } finally {
      setCargando(false);
    }
  };

  const formatearMes = (mes) => {
    const [ano, mesNum] = mes.split('-');
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${meses[parseInt(mesNum) - 1]} ${ano}`;
  };

  const getColorEstado = (estado) => {
    switch (estado) {
      case 'confirmada': return 'bg-blue-100 text-blue-700';
      case 'pendiente': return 'bg-yellow-100 text-yellow-700';
      case 'completada': return 'bg-green-100 text-green-700';
      case 'cancelada': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <FileBarChart2 className="w-8 h-8 text-primary-500" />
          Reportes y Estadísticas
        </h1>
        <p className="text-gray-500 mt-1">Visualiza el rendimiento del sistema</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Tarjetas de estadísticas */}
      {estadisticas && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {[
            {
              label: 'Citas totales',
              valor: estadisticas.citasTotales,
              icon: <Calendar className="w-6 h-6" />,
              color: 'bg-blue-50 text-blue-700 border-blue-200'
            },
            {
              label: 'Pacientes activos',
              valor: estadisticas.pacientesActivos,
              icon: <Users className="w-6 h-6" />,
              color: 'bg-purple-50 text-purple-700 border-purple-200'
            },
            {
              label: 'Médicos activos',
              valor: estadisticas.medicosActivos,
              icon: <Stethoscope className="w-6 h-6" />,
              color: 'bg-green-50 text-green-700 border-green-200'
            },
            {
              label: 'Citas completadas',
              valor: estadisticas.citasPorEstado.find(e => e.estado === 'completada')?.cantidad || 0,
              icon: <CheckCircle2 className="w-6 h-6" />,
              color: 'bg-yellow-50 text-yellow-700 border-yellow-200'
            }
          ].map((stat, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl border ${stat.color} p-6 shadow-sm hover:shadow-md transition`}
            >
              <div className="p-3 rounded-xl bg-white/50 w-fit">
                {stat.icon}
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold">{stat.valor}</p>
                <p className="text-sm mt-1 opacity-80">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Gráficos */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {/* Gráfico de citas por mes */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Citas por Mes</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={citasPorMes.map(item => ({ ...item, mes: formatearMes(item.mes) }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="mes" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Line type="monotone" dataKey="cantidad" stroke="#3B82F6" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de citas por especialidad */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Citas por Especialidad</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={citasPorEspecialidad}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ especialidad, percent }) => `${especialidad} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="cantidad"
              >
                {citasPorEspecialidad.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Citas recientes */}
      {estadisticas && estadisticas.citasRecientes.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Citas Recientes</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Paciente</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Médico</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Especialidad</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Fecha</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {estadisticas.citasRecientes.map((cita) => (
                  <tr key={cita.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">{cita.paciente_nombre}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600">{cita.medico_nombre}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600">{cita.especialidad_nombre}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600">
                        {new Date(cita.fecha).toLocaleString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize ${getColorEstado(cita.estado)}`}>
                        {cita.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportesPage;
