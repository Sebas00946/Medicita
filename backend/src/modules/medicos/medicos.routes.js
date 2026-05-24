const { Router } = require('express');
const controller  = require('./medicos.controller');
const { authMiddleware, soloRol } = require('../../middlewares/auth');
const router      = Router();

/**
 * @openapi
 * /api/medicos:
 *   get:
 *     summary: Listar médicos
 *     tags: [Médicos]
 *     parameters:
 *       - in: query
 *         name: especialidadId
 *         schema:
 *           type: integer
 *         description: Filtrar por especialidad (opcional)
 *     responses:
 *       200:
 *         description: Lista de médicos
 */
router.get('/', authMiddleware, controller.obtenerTodos);

/**
 * @openapi
 * /api/medicos/{id}:
 *   get:
 *     summary: Obtener médico por ID
 *     tags: [Médicos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Médico encontrado
 *       404:
 *         description: Médico no encontrado
 */
router.get('/:id', authMiddleware, controller.obtenerPorId);

/**
 * @openapi
 * /api/medicos:
 *   post:
 *     summary: Crear nuevo médico (solo admin)
 *     tags: [Médicos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - email
 *               - contrasena
 *               - especialidad
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               contrasena:
 *                 type: string
 *               especialidad:
 *                 type: string
 *               consultorio:
 *                 type: string
 *               telefono:
 *                 type: string
 *     responses:
 *       201:
 *         description: Médico creado
 *       409:
 *         description: Email ya registrado
 */
router.post('/', authMiddleware, soloRol('administrador'), controller.crear);

/**
 * @openapi
 * /api/medicos/{id}:
 *   put:
 *     summary: Actualizar médico (solo admin)
 *     tags: [Médicos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               especialidad:
 *                 type: string
 *               consultorio:
 *                 type: string
 *               telefono:
 *                 type: string
 *     responses:
 *       200:
 *         description: Médico actualizado
 */
router.put('/:id', authMiddleware, soloRol('administrador'), controller.actualizar);

/**
 * @openapi
 * /api/medicos/{id}:
 *   delete:
 *     summary: Desactivar médico (solo admin)
 *     tags: [Médicos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Médico desactivado
 */
router.delete('/:id', authMiddleware, soloRol('administrador'), controller.eliminar);

module.exports = router;
