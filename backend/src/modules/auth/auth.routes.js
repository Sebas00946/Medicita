const { Router } = require('express');
const controller  = require('./auth.controller');
const router      = Router();

/**
 * @openapi
 * /api/auth/registro:
 *   post:
 *     summary: Registrar nuevo paciente
 *     tags: [Auth]
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
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Ana García
 *               email:
 *                 type: string
 *                 example: ana@correo.com
 *               contrasena:
 *                 type: string
 *                 example: MiClave123!
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       409:
 *         description: Email ya registrado
 */
router.post('/registro', controller.registrar);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - contrasena
 *             properties:
 *               email:
 *                 type: string
 *               contrasena:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token JWT y datos del usuario
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', controller.login);

module.exports = router;
