import api from './api';

export const obtenerRoles = async () => {
  const { data } = await api.get('/roles');
  return data;
};

export const obtenerRolPorId = async (id) => {
  const { data } = await api.get(`/roles/${id}`);
  return data;
};

export const crearRol = async (datos) => {
  const { data } = await api.post('/roles', datos);
  return data;
};

export const actualizarRol = async (id, datos) => {
  const { data } = await api.put(`/roles/${id}`, datos);
  return data;
};

export const eliminarRol = async (id) => {
  const { data } = await api.delete(`/roles/${id}`);
  return data;
};

export const obtenerPermisosRol = async (id) => {
  const { data } = await api.get(`/roles/${id}/permisos`);
  return data;
};

export const actualizarPermisosRol = async (id, permisos) => {
  const { data } = await api.put(`/roles/${id}/permisos`, { permisos });
  return data;
};
