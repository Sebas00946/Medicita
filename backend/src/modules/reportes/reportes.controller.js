const service = require('./reportes.service');

const obtenerEstadisticas = async (req, res, next) => {
  try {
    const datos = await service.obtenerEstadisticas();
    res.json(datos);
  } catch (err) {
    next(err);
  }
};

const obtenerCitasPorMes = async (req, res, next) => {
  try {
    const datos = await service.obtenerCitasPorMes();
    res.json(datos);
  } catch (err) {
    next(err);
  }
};

const obtenerCitasPorEspecialidad = async (req, res, next) => {
  try {
    const datos = await service.obtenerCitasPorEspecialidad();
    res.json(datos);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  obtenerEstadisticas,
  obtenerCitasPorMes,
  obtenerCitasPorEspecialidad,
};
