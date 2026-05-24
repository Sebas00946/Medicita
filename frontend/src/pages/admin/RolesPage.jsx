import { useState, useEffect } from 'react';
import {
  Shield,
  Plus,
  Edit,
  Trash2,
  CheckSquare,
  Square,
  Eye,
  FilePlus,
  FileEdit,
  FileX,
  AlertCircle
} from 'lucide-react';
import {
  obtenerRoles,
  obtenerRolPorId,
  crearRol,
  actualizarRol,
  eliminarRol,
  obtenerPermisosRol,
  actualizarPermisosRol
} from '../../services/rolesService';

const RolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [rolEditar, setRolEditar] = useState(null);
  const [permisosModalAbierto, setPermisosModalAbierto] = useState(false);
  const [rolPermisos, setRolPermisos] = useState(null);
  const [permisos, setPermisos] = useState([]);
  const [form, setForm] = useState({
    nombre: '', descripcion: '' });

  useEffect(() => {
    cargarRoles();
  }, []);

  const cargarRoles = async () => {
    try {
      setCargando(true);
      const data = await obtenerRoles();
      setRoles(data);
    } catch (err) {
      setError('Error al cargar los roles');
    } finally {
      setCargando(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (rolEditar) {
        await actualizarRol(rolEditar.id, form);
      } else {
        await crearRol(form);
      }
      cerrarModal();
      cargarRoles();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar el rol');
    }
  };

  const handleEditar = (rol) => {
    setRolEditar(rol);
    setForm({ nombre: rol.nombre, descripcion: rol.descripcion || '' });
    setModalAbierto(true);
  };

  const handleEliminar = async (rol) => {
    if (!confirm(`¿Estás seguro de desactivar el rol ${rol.nombre}?`)) return;
    try {
      await eliminarRol(rol.id);
      cargarRoles();
    } catch (err) {
      setError('Error al desactivar el rol');
    }
  };

  const handleVerPermisos = async (rol) => {
    try {
      const data = await obtenerPermisosRol(rol.id);
      setRolPermisos(rol);
      setPermisos(data);
      setPermisosModalAbierto(true);
    } catch (err) {
      setError('Error al cargar los permisos');
    }
  };

  const handleGuardarPermisos = async () => {
    try {
      const permisosPayload = permisos.map((p) => ({
        formularioId: p.formulario_id,
        puedeVer: p.puede_ver,
        puedeCrear: p.puede_crear,
        puedeEditar: p.puede_editar,
        puedeEliminar: p.puede_eliminar
      }));
      await actualizarPermisosRol(rolPermisos.id, permisosPayload);
      setPermisosModalAbierto(false);
      setRolPermisos(null);
    } catch (err) {
      setError('Error al guardar los permisos');
    }
  };

  const togglePermiso = (index, campo) => {
    setPermisos((prev) => {
      const nuevos = [...prev];
      nuevos[index] = { ...nuevos[index], [campo]: !nuevos[index][campo] };
      return nuevos;
    });
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setRolEditar(null);
    setForm({ nombre: '', descripcion: '' });
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
            <Shield className="w-8 h-8 text-primary-500" />
            Gestión de Roles y Permisos
          </h1>
          <p className="text-gray-500 mt-1">Administra los roles y sus permisos en el sistema</p>
        </div>
        <button
          onClick={() => setModalAbierto(true)}
          className="bg-primary-500 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition"
        >
          <Plus className="w-5 h-5" />
          Nuevo Rol
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {roles.map((rol) => (
        <div key={rol.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary-500" />
                  {rol.nombre}
                </h3>
                {rol.descripcion && (
                  <p className="text-sm text-gray-500 mt-2">{rol.descripcion}</p>
                )}
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold mt-2 bg-gray-100 text-gray-700`}>
                  {rol.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex gap-2">
              <button
                onClick={() => handleVerPermisos(rol)}
                className="flex-1 text-primary-600 hover:bg-primary-50 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition"
              >
                <Eye className="w-4 h-4" />
                Permisos
              </button>
              <button
                onClick={() => handleEditar(rol)}
                className="flex-1 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition"
              >
                <Edit className="w-4 h-4" />
                Editar
              </button>
              <button
                onClick={() => handleEliminar(rol)}
                className="flex-1 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition"
              >
                <Trash2 className="w-4 h-4" />
                Desactivar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Nuevo/Editar Rol */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {rolEditar ? 'Editar Rol' : 'Nuevo Rol'}
              </h2>
              <button onClick={cerrarModal} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre del rol <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="flex-1 border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary-500 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-semibold"
                >
                  {rolEditar ? 'Guardar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Permisos */}
      {permisosModalAbierto && rolPermisos && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Permisos de {rolPermisos.nombre}</h2>
                <p className="text-gray-500 text-sm">Configura los permisos por formulario</p>
              </div>
              <button onClick={() => setPermisosModalAbierto(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Formulario</th>
                      <th className="text-center px-2 py-3 text-sm font-semibold text-gray-700">
                        <Eye className="w-4 h-4 mx-auto" />
                      </th>
                      <th className="text-center px-2 py-3 text-sm font-semibold text-gray-700">
                        <FilePlus className="w-4 h-4 mx-auto" />
                      </th>
                      <th className="text-center px-2 py-3 text-sm font-semibold text-gray-700">
                        <FileEdit className="w-4 h-4 mx-auto" />
                      </th>
                      <th className="text-center px-2 py-3 text-sm font-semibold text-gray-700">
                        <FileX className="w-4 h-4 mx-auto" />
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {permisos.map((permiso, index) => (
                      <tr key={permiso.formulario_id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {permiso.formulario_nombre}
                        </td>
                        <td className="px-2 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => togglePermiso(index, 'puede_ver')}
                            className="text-primary-600 hover:text-primary-800"
                          >
                            {permiso.puede_ver ? (
                              <CheckSquare className="w-5 h-5 mx-auto" />
                            ) : (
                              <Square className="w-5 h-5 mx-auto" />
                            )}
                          </button>
                        </td>
                        <td className="px-2 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => togglePermiso(index, 'puede_crear')}
                            className="text-primary-600 hover:text-primary-800"
                          >
                            {permiso.puede_crear ? (
                              <CheckSquare className="w-5 h-5 mx-auto" />
                            ) : (
                              <Square className="w-5 h-5 mx-auto" />
                            )}
                          </button>
                        </td>
                        <td className="px-2 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => togglePermiso(index, 'puede_editar')}
                            className="text-primary-600 hover:text-primary-800"
                          >
                            {permiso.puede_editar ? (
                              <CheckSquare className="w-5 h-5 mx-auto" />
                            ) : (
                              <Square className="w-5 h-5 mx-auto" />
                            )}
                          </button>
                        </td>
                        <td className="px-2 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => togglePermiso(index, 'puede_eliminar')}
                            className="text-primary-600 hover:text-primary-800"
                          >
                            {permiso.puede_eliminar ? (
                              <CheckSquare className="w-5 h-5 mx-auto" />
                            ) : (
                              <Square className="w-5 h-5 mx-auto" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="pt-6 flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setPermisosModalAbierto(false)}
                  className="flex-1 border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleGuardarPermisos}
                  className="flex-1 bg-primary-500 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-semibold"
                >
                  Guardar Permisos
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesPage;
