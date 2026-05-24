const service = require('./consultorios.service');

const listar = async (req, res, next) => {
  try {
    const items = await service.listar();
    res.json(items);
  } catch (err) {
    next(err);
  }
};

const crear = async (req, res, next) => {
  try {
    const item = await service.crear(req.body);
    res.status(201).json({ mensaje: 'Consultorio creado exitosamente', consultorio: item });
  } catch (err) {
    if (err.constraint === 'consultorios_nombre_key') {
      return res.status(409).json({ error: 'El consultorio ya existe' });
    }
    next(err);
  }
};

const actualizar = async (req, res, next) => {
  try {
    const item = await service.actualizar(req.params.id, req.body);
    if (!item) {
      return res.status(404).json({ error: 'Consultorio no encontrado' });
    }
    res.json({ mensaje: 'Consultorio actualizado exitosamente', consultorio: item });
  } catch (err) {
    next(err);
  }
};

const eliminar = async (req, res, next) => {
  try {
    const item = await service.eliminar(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Consultorio no encontrado' });
    }
    res.json({ mensaje: 'Consultorio desactivado exitosamente', consultorio: item });
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
