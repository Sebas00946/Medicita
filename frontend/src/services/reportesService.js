import api from './api';

export const obtenerEstadisticas = async () => {
  const { data } = await api.get('/reportes/estadisticas');
  return data;
};

export const obtenerCitasPorMes = async () => {
  const { data } = await api.get('/reportes/citas-por-mes');
  return data;
};

export const obtenerCitasPorEspecialidad = async () => {
  const { data } = await api.get('/reportes/citas-por-especialidad');
  return data;
};
