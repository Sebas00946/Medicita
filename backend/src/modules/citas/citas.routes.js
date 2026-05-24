const { Router }          = require('express');
const controller           = require('./citas.controller');
const { authMiddleware, soloRol } = require('../../middlewares/auth');
const router               = Router();

router.use(authMiddleware);

/**
 * @openapi
 * /api/citas/disponibles:
 *   get:
 *     summary: Obtener agendas disponibles por especialidad y fecha
 *     tags: [Citas]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: especialidadId
 *         required: true
 *         schema: { type: integer }
 *       - in: query
 *         name: fecha
 *         required: true
 *         schema: { type: string, format: date }
 *     responses:
 *       200: { description: Agendas con slots disponibles }
 */
router.get('/disponibles', soloRol('paciente', 'administrador'), controller.obtenerDisponibles);

/**
 * @openapi
 * /api/citas:
 *   get:
 *     summary: Obtener mis citas
 *     tags: [Citas]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista de citas del paciente }
 */
router.get('/', soloRol('paciente'), controller.obtenerMisCitas);

/**
 * @openapi
 * /api/citas:
 *   post:
 *     summary: Agendar nueva cita
 *     tags: [Citas]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [agendaId, fecha]
 *             properties:
 *               agendaId: { type: integer }
 *               fecha:    { type: string, format: date-time }
 *               motivo:   { type: string }
 *     responses:
 *       201: { description: Cita creada }
 */
router.post('/', soloRol('paciente'), controller.crearCita);

/**
 * @openapi
 * /api/citas/{id}/cancelar:
 *   patch:
 *     summary: Cancelar una cita
 *     tags: [Citas]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Cita cancelada }
 *       404: { description: Cita no encontrada }
 */
router.patch('/:id/cancelar', soloRol('paciente'), controller.cancelarCita);

/**
 * @openapi
 * /api/citas/sugerencias:
 *   get:
 *     summary: Obtener sugerencias de fechas disponibles
 *     tags: [Citas]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: especialidadId
 *         schema: { type: integer }
 *       - in: query
 *         name: medicoId
 *         schema: { type: integer }
 *       - in: query
 *         name: fechaInicio
 *         schema: { type: string, format: date }
 *     responses:
 *       200: { description: Lista de fechas sugeridas con disponibilidad }
 */
router.get('/sugerencias', soloRol('paciente', 'administrador'), controller.obtenerSugerencias);

/**
 * @openapi
 * /api/citas/recientes:
 *   get:
 *     summary: Obtener citas recientes del sistema
 *     tags: [Citas]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200: { description: Lista de citas recientes }
 */
router.get('/recientes', soloRol('administrador', 'medico'), controller.obtenerRecientes);

module.exports = router;
