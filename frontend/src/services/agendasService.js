import api from './api';

export const obtenerAgendas = async (params = {}) => {
  const { data } = await api.get('/agendas', { params });
  return data;
};

export const crearAgenda = async (payload) => {
  const { data } = await api.post('/agendas', payload);
  return data;
};

export const actualizarAgenda = async (id, payload) => {
  const { data } = await api.put(`/agendas/${id}`, payload);
  return data;
};

export const eliminarAgenda = async (id) => {
  const { data } = await api.delete(`/agendas/${id}`);
  return data;
};
