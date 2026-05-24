const service = require('./roles.service');

const listar = async (req, res, next) => {
  try {
    const roles = await service.listar();
    res.json(roles);
  } catch (err) {
    next(err);
  }
};

const obtenerPorId = async (req, res, next) => {
  try {
    const rol = await service.obtenerPorId(req.params.id);
    if (!rol) return res.status(404).json({ error: 'Rol no encontrado' });
    res.json(rol);
  } catch (err) {
    next(err);
  }
};

const crear = async (req, res, next) => {
  try {
    const rol = await service.crear(req.body);
    res.status(201).json({ mensaje: 'Rol creado exitosamente', rol });
  } catch (err) {
    if (err.constraint === 'roles_nombre_key') {
      return res.status(409).json({ error: 'El nombre del rol ya existe' });
    }
    next(err);
  }
};

const actualizar = async (req, res, next) => {
  try {
    const rol = await service.actualizar(req.params.id, req.body);
    if (!rol) return res.status(404).json({ error: 'Rol no encontrado' });
    res.json({ mensaje: 'Rol actualizado exitosamente', rol });
  } catch (err) {
    next(err);
  }
};

const eliminar = async (req, res, next) => {
  try {
    const rol = await service.eliminar(req.params.id);
    if (!rol) return res.status(404).json({ error: 'Rol no encontrado' });
    res.json({ mensaje: 'Rol desactivado exitosamente' });
  } catch (err) {
    next(err);
  }
};

const obtenerPermisos = async (req, res, next) => {
  try {
    const permisos = await service.obtenerPermisos(req.params.id);
    res.json(permisos);
  } catch (err) {
    next(err);
  }
};

const actualizarPermisos = async (req, res, next) => {
  try {
    const permisos = await service.actualizarPermisos(req.params.id, req.body.permisos);
    res.json({ mensaje: 'Permisos actualizados exitosamente', permisos });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listar,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
  obtenerPermisos,
  actualizarPermisos,
};
