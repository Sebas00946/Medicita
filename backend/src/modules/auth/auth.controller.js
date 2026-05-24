const authService = require('./auth.service');

const registrar = async (req, res, next) => {
  try {
    const usuario = await authService.registrar(req.body);
    res.status(201).json({ mensaje: 'Usuario creado exitosamente', usuario });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const resultado = await authService.login(req.body);
    res.json(resultado);
  } catch (err) {
    next(err);
  }
};

module.exports = { registrar, login };
