import { Calendar, Users, Stethoscope } from 'lucide-react';

const DashboardPage = () => (
  <div>
    <h1 className="text-2xl font-bold text-primary-700 mb-4">Panel de Administración</h1>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[
        { label: 'Citas hoy',          valor: '12', icon: <Calendar className="w-8 h-8" />, color: 'bg-blue-50 text-blue-700 border-blue-200' },
        { label: 'Médicos activos',     valor: '8',  icon: <Stethoscope className="w-8 h-8" />, color: 'bg-green-50 text-green-700 border-green-200' },
        { label: 'Pacientes registrados', valor: '143', icon: <Users className="w-8 h-8" />, color: 'bg-purple-50 text-purple-700 border-purple-200' },
      ].map(({ label, valor, icon, color }) => (
        <div key={label} className={`rounded-xl p-6 ${color} border shadow-sm`}>
          <div className="flex items-center gap-3">
            {icon}
            <div>
              <p className="text-3xl font-bold">{valor}</p>
              <p className="text-sm mt-1 opacity-80">{label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default DashboardPage;
