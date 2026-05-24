import api from './api';

export const obtenerMisCitas = async () => {
  const { data } = await api.get('/citas');
  return data;
};

export const agendarCita = async (datosCita) => {
  const { data } = await api.post('/citas', datosCita);
  return data;
};

export const cancelarCita = async (idCita) => {
  const { data } = await api.patch(`/citas/${idCita}/cancelar`);
  return data;
};

export const obtenerAgendasDisponibles = async ({ especialidadId, fecha }) => {
  const { data } = await api.get('/citas/disponibles', {
    params: { especialidadId, fecha },
  });
  return data;
};

export const obtenerSugerenciasFechas = async ({ especialidadId, medicoId, fechaInicio }) => {
  const { data } = await api.get('/citas/sugerencias', {
    params: { especialidadId, medicoId, fechaInicio },
  });
  return data;
};

export const obtenerCitasRecientes = async (limit = 10) => {
  const { data } = await api.get('/citas/recientes', {
    params: { limit },
  });
  return data;
};
