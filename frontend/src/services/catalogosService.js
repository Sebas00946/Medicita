import api from './api';

export const obtenerEspecialidades = async () => {
  const { data } = await api.get('/especialidades');
  return data;
};

export const crearEspecialidad = async (payload) => {
  const { data } = await api.post('/especialidades', payload);
  return data;
};

export const actualizarEspecialidad = async (id, payload) => {
  const { data } = await api.put(`/especialidades/${id}`, payload);
  return data;
};

export const obtenerConsultorios = async () => {
  const { data } = await api.get('/consultorios');
  return data;
};

export const crearConsultorio = async (payload) => {
  const { data } = await api.post('/consultorios', payload);
  return data;
};

export const actualizarConsultorio = async (id, payload) => {
  const { data } = await api.put(`/consultorios/${id}`, payload);
  return data;
};
