import api from './api';

export const obtenerMedicos = async (especialidadId = '') => {
  const { data } = await api.get('/medicos', {
    params: especialidadId ? { especialidadId } : {},
  });
  return data;
};

export const obtenerMedicoPorId = async (id) => {
  const { data } = await api.get(`/medicos/${id}`);
  return data;
};

export const crearMedico = async (datosMedico) => {
  const { data } = await api.post('/medicos', datosMedico);
  return data;
};

export const actualizarMedico = async (id, datosMedico) => {
  const { data } = await api.put(`/medicos/${id}`, datosMedico);
  return data;
};

export const eliminarMedico = async (id) => {
  const { data } = await api.delete(`/medicos/${id}`);
  return data;
};
