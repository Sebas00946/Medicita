const pool = require('../../config/db');

const listar = async () => {
  const { rows } = await pool.query(
    'SELECT id, nombre, ubicacion, descripcion, activo FROM consultorios ORDER BY nombre'
  );
  return rows;
};

const crear = async ({ nombre, ubicacion, descripcion }) => {
  const { rows } = await pool.query(
    `INSERT INTO consultorios (nombre, ubicacion, descripcion)
     VALUES ($1, $2, $3)
     RETURNING id, nombre, ubicacion, descripcion, activo`,
    [nombre, ubicacion || null, descripcion || null]
  );
  return rows[0];
};

const actualizar = async (id, { nombre, ubicacion, descripcion, activo }) => {
  const { rows } = await pool.query(
    `UPDATE consultorios
     SET nombre = COALESCE($1, nombre),
         ubicacion = COALESCE($2, ubicacion),
         descripcion = COALESCE($3, descripcion),
         activo = COALESCE($4, activo)
     WHERE id = $5
     RETURNING id, nombre, ubicacion, descripcion, activo`,
    [nombre || null, ubicacion || null, descripcion || null, typeof activo === 'boolean' ? activo : null, id]
  );
  return rows[0] || null;
};

const eliminar = async (id) => {
  const { rows } = await pool.query(
    `UPDATE consultorios
     SET activo = false
     WHERE id = $1
     RETURNING id, nombre, ubicacion, descripcion, activo`,
    [id]
  );
  return rows[0] || null;
};

module.exports = {
  listar,
  crear,
  actualizar,
  eliminar,
};
