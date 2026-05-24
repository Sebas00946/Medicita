import api from './api';

export const loginApi = async (email, contrasena) => {
  const { data } = await api.post('/auth/login', { email, contrasena });
  return data;
};

export const registroApi = async (nombre, email, contrasena) => {
  const { data } = await api.post('/auth/registro', { nombre, email, contrasena });
  return data;
};
