const service = require('./citas.service');

const obtenerMisCitas = async (req, res, next) => {
  try {
    const citas = await service.obtenerMisCitas(req.usuario.id);
    res.json(citas);
  } catch (err) { next(err); }
};

const obtenerDisponibles = async (req, res, next) => {
  try {
    const agendas = await service.obtenerDisponibles(req.query);
    res.json(agendas);
  } catch (err) { next(err); }
};

const crearCita = async (req, res, next) => {
  try {
    const cita = await service.crearCita(req.body, req.usuario.id);
    res.status(201).json(cita);
  } catch (err) { next(err); }
};

const cancelarCita = async (req, res, next) => {
  try {
    const cita = await service.cancelarCita(req.params.id, req.usuario.id);
    res.json(cita);
  } catch (err) { next(err); }
};

const obtenerSugerencias = async (req, res, next) => {
  try {
    const { especialidadId, medicoId, fechaInicio } = req.query;
    const fechas = await service.obtenerSugerenciasFechas({
      especialidadId: especialidadId ? Number(especialidadId) : null,
      medicoId: medicoId ? Number(medicoId) : null,
      fechaInicio
    });
    res.json(fechas);
  } catch (err) { next(err); }
};

const obtenerRecientes = async (req, res, next) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const citas = await service.obtenerCitasRecientes(limit);
    res.json(citas);
  } catch (err) { next(err); }
};

module.exports = { 
  obtenerMisCitas, 
  obtenerDisponibles, 
  crearCita, 
  cancelarCita,
  obtenerSugerencias,
  obtenerRecientes
};
