const pool = require('../../config/db');

const obtenerEstadisticas = async () => {
  const [citasTotales, citasPorEstado, medicosActivos, pacientesActivos, citasRecientes] = await Promise.all([
    pool.query('SELECT COUNT(*) AS total FROM citas'),
    pool.query(`
      SELECT estado, COUNT(*) AS cantidad
      FROM citas
      GROUP BY estado
      ORDER BY estado
    `),
    pool.query(`
      SELECT COUNT(*) AS total
      FROM medicos m
      JOIN usuarios u ON u.id = m.usuario_id
      WHERE u.activo = true
    `),
    pool.query(`
      SELECT COUNT(*) AS total
      FROM pacientes p
      JOIN usuarios u ON u.id = p.usuario_id
      WHERE u.activo = true
    `),
    pool.query(`
      SELECT
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
      LIMIT 10
    `),
  ]);

  return {
    citasTotales: parseInt(citasTotales.rows[0].total),
    citasPorEstado: citasPorEstado.rows,
    medicosActivos: parseInt(medicosActivos.rows[0].total),
    pacientesActivos: parseInt(pacientesActivos.rows[0].total),
    citasRecientes: citasRecientes.rows,
  };
};

const obtenerCitasPorMes = async () => {
  const { rows } = await pool.query(`
    SELECT
      TO_CHAR(DATE_TRUNC('month', fecha), 'YYYY-MM') AS mes,
      COUNT(*) AS cantidad
    FROM citas
    WHERE fecha >= NOW() - INTERVAL '6 months'
    GROUP BY DATE_TRUNC('month', fecha)
    ORDER BY mes
  `);
  return rows;
};

const obtenerCitasPorEspecialidad = async () => {
  const { rows } = await pool.query(`
    SELECT
      e.nombre AS especialidad,
      COUNT(*) AS cantidad
    FROM citas c
    JOIN especialidades e ON c.especialidad_id = e.id
    GROUP BY e.id, e.nombre
    ORDER BY cantidad DESC
  `);
  return rows;
};

module.exports = {
  obtenerEstadisticas,
  obtenerCitasPorMes,
  obtenerCitasPorEspecialidad,
};
