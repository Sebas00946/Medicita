const pool = require('../../config/db');

const toMinutes = (timeValue) => {
  const [hours, minutes] = String(timeValue).slice(0, 5).split(':').map(Number);
  return (hours * 60) + minutes;
};

const formatMinutes = (minutes) => {
  const hh = String(Math.floor(minutes / 60)).padStart(2, '0');
  const mm = String(minutes % 60).padStart(2, '0');
  return `${hh}:${mm}`;
};

const generarSlots = (agenda, ocupadas, fecha) => {
  const start = toMinutes(agenda.hora_inicio);
  const end = toMinutes(agenda.hora_fin);
  const duration = agenda.duracion_minutos;
  const ocupadasSet = new Set(ocupadas);
  const slots = [];
  const hoy = new Date();
  const fechaHoy = hoy.toISOString().slice(0, 10);

  for (let current = start; current + duration <= end; current += duration) {
    const hora = formatMinutes(current);
    const fechaHora = `${fecha}T${hora}:00`;

    if (ocupadasSet.has(hora)) {
      continue;
    }

    if (fecha === fechaHoy && new Date(fechaHora) <= hoy) {
      continue;
    }

    slots.push(hora);
  }

  return slots;
};

const obtenerMisCitas = async (usuarioId) => {
  const { rows } = await pool.query(
    `SELECT
            c.id,
            c.fecha,
            c.motivo,
            c.estado,
            u.nombre AS medico_nombre,
            e.nombre AS especialidad,
            con.nombre AS consultorio
     FROM citas c
     JOIN pacientes p ON c.paciente_id = p.id
     JOIN medicos m ON c.medico_id = m.id
     JOIN usuarios u ON m.usuario_id = u.id
     JOIN especialidades e ON e.id = c.especialidad_id
     JOIN agendas a ON a.id = c.agenda_id
     JOIN consultorios con ON con.id = a.consultorio_id
     WHERE p.usuario_id = $1
     ORDER BY c.fecha DESC`,
    [usuarioId]
  );
  return rows;
};

const obtenerDisponibles = async ({ especialidadId, fecha }) => {
  if (!especialidadId || !fecha) {
    throw Object.assign(new Error('Debes enviar especialidadId y fecha'), { status: 400 });
  }

  const diaSemana = new Date(`${fecha}T00:00:00`).getDay();

  const { rows: agendas } = await pool.query(
    `SELECT
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
        con.nombre AS consultorio_nombre,
        con.ubicacion AS consultorio_ubicacion
     FROM agendas a
     JOIN medicos m ON m.id = a.medico_id
     JOIN usuarios u ON u.id = m.usuario_id
     JOIN especialidades e ON e.id = a.especialidad_id
     JOIN consultorios con ON con.id = a.consultorio_id
     WHERE a.activo = true
       AND u.activo = true
       AND e.activa = true
       AND con.activo = true
       AND a.especialidad_id = $1
       AND a.dia_semana = $2
     ORDER BY u.nombre, a.hora_inicio`,
    [especialidadId, diaSemana]
  );

  if (!agendas.length) {
    return [];
  }

  const medicoIds = [...new Set(agendas.map((agenda) => agenda.medico_id))];
  const { rows: ocupadas } = await pool.query(
    `SELECT medico_id, TO_CHAR(fecha, 'HH24:MI') AS hora
     FROM citas
     WHERE medico_id = ANY($1::int[])
       AND DATE(fecha) = $2::date
       AND estado IN ('pendiente', 'confirmada')`,
    [medicoIds, fecha]
  );

  return agendas
    .map((agenda) => {
      const horasOcupadas = ocupadas
        .filter((cita) => cita.medico_id === agenda.medico_id)
        .map((cita) => cita.hora);

      return {
        ...agenda,
        slots: generarSlots(agenda, horasOcupadas, fecha),
      };
    })
    .filter((agenda) => agenda.slots.length > 0);
};

const crearCita = async ({ agendaId, fecha, motivo }, usuarioId) => {
  const { rows: pacientes } = await pool.query(
    'SELECT id FROM pacientes WHERE usuario_id = $1',
    [usuarioId]
  );

  if (!pacientes.length) {
    throw Object.assign(new Error('Perfil de paciente no encontrado'), { status: 404 });
  }

  const { rows: agendas } = await pool.query(
    `SELECT
        a.*,
        e.nombre AS especialidad_nombre
     FROM agendas a
     JOIN especialidades e ON e.id = a.especialidad_id
     WHERE a.id = $1
       AND a.activo = true`,
    [agendaId]
  );

  if (!agendas.length) {
    throw Object.assign(new Error('La agenda seleccionada no existe o está inactiva'), { status: 404 });
  }

  const agenda = agendas[0];
  const fechaBase = fecha.slice(0, 10);
  const horaBase = fecha.slice(11, 16);
  const diaSemana = new Date(`${fechaBase}T00:00:00`).getDay();

  if (diaSemana !== agenda.dia_semana) {
    throw Object.assign(new Error('La fecha seleccionada no corresponde al día configurado en la agenda'), { status: 400 });
  }

  const horaMinutos = toMinutes(horaBase);
  const inicio = toMinutes(agenda.hora_inicio);
  const fin = toMinutes(agenda.hora_fin);

  if (horaMinutos < inicio || horaMinutos >= fin) {
    throw Object.assign(new Error('La hora seleccionada está fuera del rango de la agenda'), { status: 400 });
  }

  if (((horaMinutos - inicio) % agenda.duracion_minutos) !== 0 || (horaMinutos + agenda.duracion_minutos) > fin) {
    throw Object.assign(new Error('La hora seleccionada no coincide con un bloque válido de la agenda'), { status: 400 });
  }

  const { rows: conflictoPaciente } = await pool.query(
    `SELECT id
     FROM citas
     WHERE paciente_id = $1
       AND fecha = $2
       AND estado IN ('pendiente', 'confirmada')`,
    [pacientes[0].id, fecha]
  );

  if (conflictoPaciente.length) {
    throw Object.assign(new Error('Ya tienes una cita activa en esa misma fecha y hora'), { status: 409 });
  }

  const { rows } = await pool.query(
    `INSERT INTO citas (paciente_id, agenda_id, medico_id, especialidad_id, fecha, motivo)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [pacientes[0].id, agenda.id, agenda.medico_id, agenda.especialidad_id, fecha, motivo || null]
  );

  return rows[0];
};

const cancelarCita = async (citaId, usuarioId) => {
  const { rows } = await pool.query(
    `UPDATE citas SET estado = 'cancelada'
     WHERE id = $1
       AND paciente_id = (SELECT id FROM pacientes WHERE usuario_id = $2)
       AND estado NOT IN ('cancelada','completada')
     RETURNING *`,
    [citaId, usuarioId]
  );
  if (!rows.length) throw Object.assign(new Error('Cita no encontrada o no se puede cancelar'), { status: 404 });
  return rows[0];
};

const obtenerSugerenciasFechas = async ({ especialidadId, medicoId = null, fechaInicio = null }) => {
  const fechaBase = fechaInicio ? new Date(fechaInicio) : new Date();
  const fechasSugeridas = [];
  let fechasRevisadas = 0;
  const maxDias = 30;

  while (fechasRevisadas < maxDias) {
    const fecha = new Date(fechaBase);
    fecha.setDate(fecha.getDate() + fechasRevisadas);
    const fechaStr = fecha.toISOString().slice(0, 10);
    const diaSemana = fecha.getDay();

    try {
      const params = [diaSemana];
      let query = `
        SELECT DISTINCT
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
          con.nombre AS consultorio_nombre,
          con.ubicacion AS consultorio_ubicacion
        FROM agendas a
        JOIN medicos m ON m.id = a.medico_id
        JOIN usuarios u ON u.id = m.usuario_id
        JOIN especialidades e ON e.id = a.especialidad_id
        JOIN consultorios con ON con.id = a.consultorio_id
        WHERE a.activo = true
          AND u.activo = true
          AND e.activa = true
          AND con.activo = true
          AND a.dia_semana = $1
      `;

      if (especialidadId) {
        query += ' AND a.especialidad_id = $2';
        params.push(especialidadId);
      }

      if (medicoId) {
        query += ' AND a.medico_id = $' + (especialidadId ? '3' : '2');
        params.push(medicoId);
      }

      query += ' ORDER BY u.nombre, a.hora_inicio';

      const { rows: agendas } = await pool.query(query, params);

      if (agendas.length > 0) {
        const medicoIds = [...new Set(agendas.map((a) => a.medico_id))];
        const { rows: ocupadas } = await pool.query(
          `SELECT medico_id, TO_CHAR(fecha, 'HH24:MI') AS hora
           FROM citas
           WHERE medico_id = ANY($1::int[])
             AND DATE(fecha) = $2::date
             AND estado IN ('pendiente', 'confirmada')`,
          [medicoIds, fechaStr]
        );

        const agendasConSlots = agendas
          .map((agenda) => {
            const horasOcupadas = ocupadas
              .filter((cita) => cita.medico_id === agenda.medico_id)
              .map((cita) => cita.hora);
            const slots = generarSlots(agenda, horasOcupadas, fechaStr);
            return { ...agenda, slots };
          })
          .filter((a) => a.slots.length > 0);

        if (agendasConSlots.length > 0) {
          fechasSugeridas.push({
            fecha: fechaStr,
            agendas: agendasConSlots
          });

          if (fechasSugeridas.length >= 5) {
            break;
          }
        }
      }
    } catch (err) {
      console.error('Error al revisar fecha:', err);
    }

    fechasRevisadas++;
  }

  return fechasSugeridas;
};

const obtenerCitasRecientes = async (limit = 10) => {
  const { rows } = await pool.query(
    `SELECT
        c.id,
        c.fecha,
        c.motivo,
        c.estado,
        u_paciente.nombre AS paciente_nombre,
        u_medico.nombre AS medico_nombre,
        e.nombre AS especialidad_nombre
     FROM citas c
     JOIN pacientes p ON c.paciente_id = p.id
     JOIN usuarios u_paciente ON p.usuario_id = u_paciente.id
     JOIN medicos m ON c.medico_id = m.id
     JOIN usuarios u_medico ON m.usuario_id = u_medico.id
     JOIN especialidades e ON c.especialidad_id = e.id
     ORDER BY c.fecha DESC
     LIMIT $1`,
    [limit]
  );
  return rows;
};

module.exports = { 
  obtenerMisCitas, 
  obtenerDisponibles, 
  crearCita, 
  cancelarCita,
  obtenerSugerenciasFechas,
  obtenerCitasRecientes
};
