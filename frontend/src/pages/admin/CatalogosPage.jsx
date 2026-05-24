import { useEffect, useState } from 'react';
import { Building2, Plus, Sparkles, AlertCircle } from 'lucide-react';
import {
  actualizarConsultorio,
  actualizarEspecialidad,
  crearConsultorio,
  crearEspecialidad,
  obtenerConsultorios,
  obtenerEspecialidades,
} from '../../services/catalogosService';

const CatalogosPage = () => {
  const [especialidades, setEspecialidades] = useState([]);
  const [consultorios, setConsultorios] = useState([]);
  const [error, setError] = useState('');
  const [especialidadNombre, setEspecialidadNombre] = useState('');
  const [consultorioNombre, setConsultorioNombre] = useState('');

  const cargar = async () => {
    try {
      const [especialidadesData, consultoriosData] = await Promise.all([
        obtenerEspecialidades(),
        obtenerConsultorios(),
      ]);
      setEspecialidades(especialidadesData);
      setConsultorios(consultoriosData);
    } catch {
      setError('No se pudieron cargar los catálogos');
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleCrearEspecialidad = async (e) => {
    e.preventDefault();
    try {
      await crearEspecialidad({ nombre: especialidadNombre });
      setEspecialidadNombre('');
      cargar();
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo crear la especialidad');
    }
  };

  const handleCrearConsultorio = async (e) => {
    e.preventDefault();
    try {
      await crearConsultorio({ nombre: consultorioNombre });
      setConsultorioNombre('');
      cargar();
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo crear el consultorio');
    }
  };

  const toggleEspecialidad = async (item) => {
    await actualizarEspecialidad(item.id, { activa: !item.activa });
    cargar();
  };

  const toggleConsultorio = async (item) => {
    await actualizarConsultorio(item.id, { activo: !item.activo });
    cargar();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Catálogos del sistema</h1>
        <p className="text-gray-500 mt-1">Gestiona especialidades y consultorios sin límites.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary-500" />
            <h2 className="text-xl font-semibold text-gray-900">Especialidades</h2>
          </div>

          <form onSubmit={handleCrearEspecialidad} className="flex gap-3 mb-4">
            <input
              value={especialidadNombre}
              onChange={(e) => setEspecialidadNombre(e.target.value)}
              placeholder="Nueva especialidad"
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 bg-gray-50"
            />
            <button className="bg-primary-500 hover:bg-primary-700 text-white px-4 py-3 rounded-xl">
              <Plus className="w-5 h-5" />
            </button>
          </form>

          <div className="space-y-3">
            {especialidades.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3">
                <div>
                  <p className="font-medium text-gray-900">{item.nombre}</p>
                  <p className="text-xs text-gray-500">{item.activa ? 'Activa' : 'Inactiva'}</p>
                </div>
                <button
                  onClick={() => toggleEspecialidad(item)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${item.activa ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}
                >
                  {item.activa ? 'Desactivar' : 'Activar'}
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-primary-500" />
            <h2 className="text-xl font-semibold text-gray-900">Consultorios</h2>
          </div>

          <form onSubmit={handleCrearConsultorio} className="flex gap-3 mb-4">
            <input
              value={consultorioNombre}
              onChange={(e) => setConsultorioNombre(e.target.value)}
              placeholder="Nuevo consultorio"
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 bg-gray-50"
            />
            <button className="bg-primary-500 hover:bg-primary-700 text-white px-4 py-3 rounded-xl">
              <Plus className="w-5 h-5" />
            </button>
          </form>

          <div className="space-y-3">
            {consultorios.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3">
                <div>
                  <p className="font-medium text-gray-900">{item.nombre}</p>
                  <p className="text-xs text-gray-500">{item.activo ? 'Activo' : 'Inactivo'}</p>
                </div>
                <button
                  onClick={() => toggleConsultorio(item)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${item.activo ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}
                >
                  {item.activo ? 'Desactivar' : 'Activar'}
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CatalogosPage;
