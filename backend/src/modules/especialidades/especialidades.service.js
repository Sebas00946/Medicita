const pool = require('../../config/db');

const listar = async () => {
  const { rows } = await pool.query(
    'SELECT id, nombre, descripcion, activa FROM especialidades ORDER BY nombre'
  );
  return rows;
};

const crear = async ({ nombre, descripcion }) => {
  const { rows } = await pool.query(
    `INSERT INTO especialidades (nombre, descripcion)
     VALUES ($1, $2)
     RETURNING id, nombre, descripcion, activa`,
    [nombre, descripcion || null]
  );
  return rows[0];
};

const actualizar = async (id, { nombre, descripcion, activa }) => {
  const { rows } = await pool.query(
    `UPDATE especialidades
     SET nombre = COALESCE($1, nombre),
         descripcion = COALESCE($2, descripcion),
         activa = COALESCE($3, activa)
     WHERE id = $4
     RETURNING id, nombre, descripcion, activa`,
    [nombre || null, descripcion || null, typeof activa === 'boolean' ? activa : null, id]
  );
  return rows[0] || null;
};

const eliminar = async (id) => {
  const { rows } = await pool.query(
    `UPDATE especialidades
     SET activa = false
     WHERE id = $1
     RETURNING id, nombre, descripcion, activa`,
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
