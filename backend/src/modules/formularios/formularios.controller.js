const service = require('./formularios.service');

const listar = async (req, res, next) => {
  try {
    const formularios = await service.listar();
    res.json(formularios);
  } catch (err) {
    next(err);
  }
};

const crear = async (req, res, next) => {
  try {
    const formulario = await service.crear(req.body);
    res.status(201).json({ mensaje: 'Formulario creado exitosamente', formulario });
  } catch (err) {
    if (err.constraint === 'formularios_nombre_key') {
      return res.status(409).json({ error: 'El nombre del formulario ya existe' });
    }
    next(err);
  }
};

const actualizar = async (req, res, next) => {
  try {
    const formulario = await service.actualizar(req.params.id, req.body);
    if (!formulario) return res.status(404).json({ error: 'Formulario no encontrado' });
    res.json({ mensaje: 'Formulario actualizado exitosamente', formulario });
  } catch (err) {
    next(err);
  }
};

const eliminar = async (req, res, next) => {
  try {
    const formulario = await service.eliminar(req.params.id);
    if (!formulario) return res.status(404).json({ error: 'Formulario no encontrado' });
    res.json({ mensaje: 'Formulario desactivado exitosamente' });
  } catch (err) {
    next(err);
  }
};

module.exports = { listar, crear, actualizar, eliminar };
