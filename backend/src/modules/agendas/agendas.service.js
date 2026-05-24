const pool = require('../../config/db');

const validarAgenda = async (client, { medicoId, especialidadId, consultorioId, diaSemana, horaInicio, horaFin }, agendaId = null) => {
  const { rows: medicoEspecialidad } = await client.query(
    `SELECT 1
     FROM medico_especialidades
     WHERE medico_id = $1 AND especialidad_id = $2`,
    [medicoId, especialidadId]
  );

  if (!medicoEspecialidad.length) {
    throw Object.assign(new Error('El médico no tiene asociada la especialidad seleccionada'), { status: 400 });
  }

  const { rows: consultorio } = await client.query(
    'SELECT id FROM consultorios WHERE id = $1 AND activo = true',
    [consultorioId]
  );

  if (!consultorio.length) {
    throw Object.assign(new Error('El consultorio seleccionado no está disponible'), { status: 400 });
  }

  const params = [medicoId, diaSemana, horaFin, horaInicio];
  let conflictQuery = `
    SELECT id
    FROM agendas
    WHERE medico_id = $1
      AND dia_semana = $2
      AND activo = true
      AND NOT ($3 <= hora_inicio OR $4 >= hora_fin)
  `;

  if (agendaId) {
    params.push(agendaId);
    conflictQuery += ' AND id <> $5';
  }

  const { rows: conflictos } = await client.query(conflictQuery, params);

  if (conflictos.length) {
    throw Object.assign(
      new Error('El médico ya tiene otra agenda en ese rango horario, incluso en otro consultorio'),
      { status: 409 }
    );
  }
};

const listar = async ({ medicoId, especialidadId, usuario }) => {
  const params = [];
  let where = 'WHERE a.activo = true';

  if (usuario?.rol === 'medico') {
    params.push(usuario.id);
    where += ' AND u.id = $1';
  }

  if (medicoId) {
    params.push(Number(medicoId));
    where += ` AND a.medico_id = $${params.length}`;
  }

  if (especialidadId) {
    params.push(Number(especialidadId));
    where += ` AND a.especialidad_id = $${params.length}`;
  }

  const { rows } = await pool.query(
    `
      SELECT
        a.id,
        a.medico_id,
        a.especialidad_id,
        a.consultorio_id,
        a.dia_semana,
        a.hora_inicio,
        a.hora_fin,
        a.duracion_minutos,
        u.nombre AS medico_nombre,
        e.nombre AS especialidad_nombre,
        c.nombre AS consultorio_nombre,
        c.ubicacion AS consultorio_ubicacion
      FROM agendas a
      JOIN medicos m ON m.id = a.medico_id
      JOIN usuarios u ON u.id = m.usuario_id
      JOIN especialidades e ON e.id = a.especialidad_id
      JOIN consultorios c ON c.id = a.consultorio_id
      ${where}
      ORDER BY a.dia_semana, a.hora_inicio, u.nombre
    `,
    params
  );

  return rows;
};

const crear = async (payload) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await validarAgenda(client, payload);

    const { rows } = await client.query(
      `INSERT INTO agendas (
        medico_id, especialidad_id, consultorio_id, dia_semana, hora_inicio, hora_fin, duracion_minutos
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        payload.medicoId,
        payload.especialidadId,
        payload.consultorioId,
        payload.diaSemana,
        payload.horaInicio,
        payload.horaFin,
        payload.duracionMinutos || 30,
      ]
    );

    await client.query('COMMIT');
    return rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const actualizar = async (id, payload) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const agendaActual = await client.query('SELECT * FROM agendas WHERE id = $1', [id]);
    if (!agendaActual.rows.length) {
      await client.query('ROLLBACK');
      return null;
    }

    const actual = agendaActual.rows[0];
    const merged = {
      medicoId: payload.medicoId || actual.medico_id,
      especialidadId: payload.especialidadId || actual.especialidad_id,
      consultorioId: payload.consultorioId || actual.consultorio_id,
      diaSemana: payload.diaSemana ?? actual.dia_semana,
      horaInicio: payload.horaInicio || actual.hora_inicio,
      horaFin: payload.horaFin || actual.hora_fin,
      duracionMinutos: payload.duracionMinutos || actual.duracion_minutos,
    };

    await validarAgenda(client, merged, id);

    const { rows } = await client.query(
      `UPDATE agendas
       SET medico_id = $1,
           especialidad_id = $2,
           consultorio_id = $3,
           dia_semana = $4,
           hora_inicio = $5,
           hora_fin = $6,
           duracion_minutos = $7,
           activo = COALESCE($8, activo)
       WHERE id = $9
       RETURNING *`,
      [
        merged.medicoId,
        merged.especialidadId,
        merged.consultorioId,
        merged.diaSemana,
        merged.horaInicio,
        merged.horaFin,
        merged.duracionMinutos,
        typeof payload.activo === 'boolean' ? payload.activo : null,
        id,
      ]
    );

    await client.query('COMMIT');
    return rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const eliminar = async (id) => {
  const { rows } = await pool.query(
    `UPDATE agendas
     SET activo = false
     WHERE id = $1
     RETURNING *`,
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
