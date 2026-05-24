const pool = require('../../config/db');

const listar = async () => {
  const { rows } = await pool.query(
    'SELECT id, nombre, ruta, icono, orden, activo FROM formularios ORDER BY orden, nombre'
  );
  return rows;
};

const crear = async ({ nombre, ruta, icono, orden }) => {
  const { rows } = await pool.query(
    `INSERT INTO formularios (nombre, ruta, icono, orden)
     VALUES ($1, $2, $3, $4)
     RETURNING id, nombre, ruta, icono, orden, activo`,
    [nombre, ruta || null, icono || null, orden || 0]
  );
  return rows[0];
};

const actualizar = async (id, { nombre, ruta, icono, orden, activo }) => {
  const { rows } = await pool.query(
    `UPDATE formularios
     SET nombre = COALESCE($1, nombre),
         ruta = COALESCE($2, ruta),
         icono = COALESCE($3, icono),
         orden = COALESCE($4, orden),
         activo = COALESCE($5, activo)
     WHERE id = $6
     RETURNING id, nombre, ruta, icono, orden, activo`,
    [
      nombre || null,
      ruta || null,
      icono || null,
      typeof orden === 'number' ? orden : null,
      typeof activo === 'boolean' ? activo : null,
      id,
    ]
  );
  return rows[0] || null;
};

const eliminar = async (id) => {
  const { rows } = await pool.query(
    `UPDATE formularios SET activo = false WHERE id = $1 RETURNING id, nombre, ruta, icono, orden, activo`,
    [id]
  );
  return rows[0] || null;
};

module.exports = { listar, crear, actualizar, eliminar };
