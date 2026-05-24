const service = require('./agendas.service');

const listar = async (req, res, next) => {
  try {
    const agendas = await service.listar({ ...req.query, usuario: req.usuario });
    res.json(agendas);
  } catch (err) {
    next(err);
  }
};

const crear = async (req, res, next) => {
  try {
    const agenda = await service.crear(req.body);
    res.status(201).json({ mensaje: 'Agenda creada exitosamente', agenda });
  } catch (err) {
    next(err);
  }
};

const actualizar = async (req, res, next) => {
  try {
    const agenda = await service.actualizar(req.params.id, req.body);
    if (!agenda) {
      return res.status(404).json({ error: 'Agenda no encontrada' });
    }
    res.json({ mensaje: 'Agenda actualizada exitosamente', agenda });
  } catch (err) {
    next(err);
  }
};

const eliminar = async (req, res, next) => {
  try {
    const agenda = await service.eliminar(req.params.id);
    if (!agenda) {
      return res.status(404).json({ error: 'Agenda no encontrada' });
    }
    res.json({ mensaje: 'Agenda desactivada exitosamente', agenda });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listar,
  crear,
  actualizar,
  eliminar,
};
