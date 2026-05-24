import api from './api';

export const obtenerFormularios = async () => {
  const { data } = await api.get('/formularios');
  return data;
};

export const crearFormulario = async (datos) => {
  const { data } = await api.post('/formularios', datos);
  return data;
};

export const actualizarFormulario = async (id, datos) => {
  const { data } = await api.put(`/formularios/${id}`, datos);
  return data;
};

export const eliminarFormulario = async (id) => {
  const { data } = await api.delete(`/formularios/${id}`);
  return data;
};
