const service = require('./medicos.service');

const obtenerTodos = async (req, res, next) => {
  try {
    const { especialidadId } = req.query;
    const medicos = await service.obtenerTodos(especialidadId);
    res.json(medicos);
  } catch (err) {
    next(err);
  }
};

const obtenerPorId = async (req, res, next) => {
  try {
    const medico = await service.obtenerPorId(req.params.id);
    if (!medico) {
      return res.status(404).json({ error: 'Médico no encontrado' });
    }
    res.json(medico);
  } catch (err) {
    next(err);
  }
};

const crear = async (req, res, next) => {
  try {
    const medico = await service.crear(req.body);
    res.status(201).json({ mensaje: 'Médico creado exitosamente', medico });
  } catch (err) {
    if (err.constraint === 'usuarios_email_key') {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }
    next(err);
  }
};

const actualizar = async (req, res, next) => {
  try {
    const medico = await service.actualizar(req.params.id, req.body);
    if (!medico) {
      return res.status(404).json({ error: 'Médico no encontrado' });
    }
    res.json({ mensaje: 'Médico actualizado exitosamente', medico });
  } catch (err) {
    next(err);
  }
};

const eliminar = async (req, res, next) => {
  try {
    const medico = await service.eliminar(req.params.id);
    if (!medico) {
      return res.status(404).json({ error: 'Médico no encontrado' });
    }
    res.json({ mensaje: 'Médico desactivado exitosamente' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
};
