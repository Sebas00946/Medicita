const pool = require('../../config/db');

const listar = async () => {
  const { rows } = await pool.query(
    'SELECT id, nombre, descripcion, activo FROM roles ORDER BY nombre'
  );
  return rows;
};

const obtenerPorId = async (id) => {
  const { rows } = await pool.query(
    'SELECT id, nombre, descripcion, activo FROM roles WHERE id = $1',
    [id]
  );
  return rows[0] || null;
};

const crear = async ({ nombre, descripcion }) => {
  const { rows } = await pool.query(
    `INSERT INTO roles (nombre, descripcion)
     VALUES ($1, $2)
     RETURNING id, nombre, descripcion, activo`,
    [nombre, descripcion || null]
  );
  return rows[0];
};

const actualizar = async (id, { nombre, descripcion, activo }) => {
  const { rows } = await pool.query(
    `UPDATE roles
     SET nombre = COALESCE($1, nombre),
         descripcion = COALESCE($2, descripcion),
         activo = COALESCE($3, activo)
     WHERE id = $4
     RETURNING id, nombre, descripcion, activo`,
    [nombre || null, descripcion || null, typeof activo === 'boolean' ? activo : null, id]
  );
  return rows[0] || null;
};

const eliminar = async (id) => {
  const { rows } = await pool.query(
    `UPDATE roles SET activo = false WHERE id = $1 RETURNING id, nombre, descripcion, activo`,
    [id]
  );
  return rows[0] || null;
};

const obtenerPermisos = async (rolId) => {
  const { rows } = await pool.query(
    `SELECT 
       f.id AS formulario_id,
       f.nombre AS formulario_nombre,
       f.ruta AS formulario_ruta,
       f.icono AS formulario_icono,
       COALESCE(p.puede_ver, false) AS puede_ver,
       COALESCE(p.puede_crear, false) AS puede_crear,
       COALESCE(p.puede_editar, false) AS puede_editar,
       COALESCE(p.puede_eliminar, false) AS puede_eliminar
     FROM formularios f
     LEFT JOIN permisos p ON p.formulario_id = f.id AND p.rol_id = $1
     WHERE f.activo = true
     ORDER BY f.orden, f.nombre`,
    [rolId]
  );
  return rows;
};

const actualizarPermisos = async (rolId, permisos) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM permisos WHERE rol_id = $1', [rolId]);

    for (const permiso of permisos) {
      await client.query(
        `INSERT INTO permisos (rol_id, formulario_id, puede_ver, puede_crear, puede_editar, puede_eliminar)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          rolId,
          permiso.formularioId,
          permiso.puedeVer || false,
          permiso.puedeCrear || false,
          permiso.puedeEditar || false,
          permiso.puedeEliminar || false,
        ]
      );
    }

    await client.query('COMMIT');
    return obtenerPermisos(rolId);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
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
