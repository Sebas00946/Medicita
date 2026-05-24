const pool = require('../../config/db');
const bcrypt = require('bcryptjs');

const mapMedico = (row) => ({
  id: row.id,
  usuario_id: row.usuario_id,
  nombre: row.nombre,
  email: row.email,
  telefono: row.telefono,
  registro: row.registro,
  especialidades: row.especialidades || [],
  especialidad_ids: row.especialidad_ids || [],
});

const consultaBase = `
  SELECT
    m.id,
    m.usuario_id,
    m.telefono,
    m.registro,
    u.nombre,
    u.email,
    COALESCE(
      JSON_AGG(
        DISTINCT JSONB_BUILD_OBJECT('id', e.id, 'nombre', e.nombre)
      ) FILTER (WHERE e.id IS NOT NULL),
      '[]'::json
    ) AS especialidades,
    COALESCE(ARRAY_AGG(DISTINCT e.id) FILTER (WHERE e.id IS NOT NULL), ARRAY[]::INTEGER[]) AS especialidad_ids
  FROM medicos m
  JOIN usuarios u ON u.id = m.usuario_id
  LEFT JOIN medico_especialidades me ON me.medico_id = m.id
  LEFT JOIN especialidades e ON e.id = me.especialidad_id
  WHERE u.activo = true
`;

const validarEspecialidades = async (client, especialidadIds = []) => {
  if (!Array.isArray(especialidadIds) || especialidadIds.length === 0) {
    throw Object.assign(new Error('Debes asignar al menos una especialidad al médico'), { status: 400 });
  }

  if (especialidadIds.length > 3) {
    throw Object.assign(new Error('Un médico no puede tener más de 3 especialidades'), { status: 400 });
  }

  const idsUnicos = [...new Set(especialidadIds.map(id => Number(id)))];
  if (idsUnicos.length !== especialidadIds.length) {
    throw Object.assign(new Error('No se permite seleccionar la misma especialidad más de una vez'), { status: 400 });
  }

  const { rows } = await client.query(
    'SELECT id FROM especialidades WHERE id = ANY($1::int[]) AND activa = true',
    [especialidadIds]
  );

  if (rows.length !== especialidadIds.length) {
    throw Object.assign(new Error('Una o más especialidades no son válidas'), { status: 400 });
  }
};

const obtenerTodos = async (especialidadId = null) => {
  const params = [];
  let query = consultaBase;

  if (especialidadId) {
    params.push(Number(especialidadId));
    query += ' AND EXISTS (SELECT 1 FROM medico_especialidades mef WHERE mef.medico_id = m.id AND mef.especialidad_id = $1)';
  }

  query += `
    GROUP BY m.id, m.usuario_id, m.telefono, m.registro, u.nombre, u.email
    ORDER BY u.nombre
  `;

  const { rows } = await pool.query(query, params);
  return rows.map(mapMedico);
};

const obtenerPorId = async (id) => {
  const query = `
    ${consultaBase}
    AND m.id = $1
    GROUP BY m.id, m.usuario_id, m.telefono, m.registro, u.nombre, u.email
  `;
  const { rows } = await pool.query(query, [id]);
  return rows[0] ? mapMedico(rows[0]) : null;
};

const crear = async ({ nombre, email, contrasena, telefono, registro, especialidadIds }) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await validarEspecialidades(client, especialidadIds);

    const hash = await bcrypt.hash(contrasena, 10);
    const usuarioResult = await client.query(
      `INSERT INTO usuarios (nombre, email, contrasena, rol)
       VALUES ($1, $2, $3, 'medico')
       RETURNING id`,
      [nombre, email, hash]
    );

    const usuarioId = usuarioResult.rows[0].id;

    const medicoResult = await client.query(
      `INSERT INTO medicos (usuario_id, telefono, registro)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [usuarioId, telefono || null, registro || null]
    );

    const medicoId = medicoResult.rows[0].id;

    for (const especialidadId of especialidadIds) {
      await client.query(
        'INSERT INTO medico_especialidades (medico_id, especialidad_id) VALUES ($1, $2)',
        [medicoId, especialidadId]
      );
    }

    await client.query('COMMIT');
    return obtenerPorId(medicoId);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const actualizar = async (id, { nombre, email, contrasena, telefono, registro, especialidadIds }) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const medicoActual = await client.query('SELECT usuario_id FROM medicos WHERE id = $1', [id]);
    if (!medicoActual.rows.length) {
      await client.query('ROLLBACK');
      return null;
    }

    const usuarioId = medicoActual.rows[0].usuario_id;

    if (Array.isArray(especialidadIds)) {
      await validarEspecialidades(client, especialidadIds);
    }

    const hash = contrasena ? await bcrypt.hash(contrasena, 10) : null;

    await client.query(
      `UPDATE usuarios
       SET nombre = COALESCE($1, nombre),
           email = COALESCE($2, email),
           contrasena = COALESCE($3, contrasena)
       WHERE id = $4`,
      [nombre || null, email || null, hash, usuarioId]
    );

    await client.query(
      `UPDATE medicos
       SET telefono = COALESCE($1, telefono),
           registro = COALESCE($2, registro)
       WHERE id = $3`,
      [telefono || null, registro || null, id]
    );

    if (Array.isArray(especialidadIds)) {
      await client.query('DELETE FROM medico_especialidades WHERE medico_id = $1', [id]);
      for (const especialidadId of especialidadIds) {
        await client.query(
          'INSERT INTO medico_especialidades (medico_id, especialidad_id) VALUES ($1, $2)',
          [id, especialidadId]
        );
      }
    }

    await client.query('COMMIT');
    return obtenerPorId(id);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const eliminar = async (id) => {
  const medico = await obtenerPorId(id);
  if (!medico) {
    return null;
  }

  await pool.query('UPDATE usuarios SET activo = false WHERE id = $1', [medico.usuario_id]);
  return medico;
};

module.exports = {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
};
