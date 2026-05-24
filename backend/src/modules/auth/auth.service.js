const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const pool   = require('../../config/db');

const registrar = async ({ nombre, email, contrasena }) => {
  const existe = await pool.query(
    'SELECT id FROM usuarios WHERE email = $1', [email]
  );
  if (existe.rows.length > 0) {
    const error = new Error('El email ya está registrado');
    error.status = 409;
    throw error;
  }

  const hash = await bcrypt.hash(contrasena, 10);
  const resultado = await pool.query(
    `INSERT INTO usuarios (nombre, email, contrasena, rol)
     VALUES ($1, $2, $3, 'paciente')
     RETURNING id, nombre, email, rol`,
    [nombre, email, hash]
  );

  const usuarioCreado = resultado.rows[0];

  await pool.query(
    'INSERT INTO pacientes (usuario_id) VALUES ($1)',
    [usuarioCreado.id]
  );

  return usuarioCreado;
};

const login = async ({ email, contrasena }) => {
  const resultado = await pool.query(
    'SELECT * FROM usuarios WHERE email = $1 AND activo = true', [email]
  );
  const usuario = resultado.rows[0];

  if (!usuario) {
    const error = new Error('Credenciales inválidas');
    error.status = 401;
    throw error;
  }

  const passwordOk = await bcrypt.compare(contrasena, usuario.contrasena);
  if (!passwordOk) {
    const error = new Error('Credenciales inválidas');
    error.status = 401;
    throw error;
  }

  const token = jwt.sign(
    { id: usuario.id, email: usuario.email, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return {
    token,
    usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
  };
};

module.exports = { registrar, login };
