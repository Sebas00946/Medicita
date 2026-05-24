const { Router } = require('express');
const controller = require('./reportes.controller');
const { authMiddleware, soloRol } = require('../../middlewares/auth');

const router = Router();

router.get('/estadisticas', authMiddleware, controller.obtenerEstadisticas);
router.get('/citas-por-mes', authMiddleware, controller.obtenerCitasPorMes);
router.get('/citas-por-especialidad', authMiddleware, controller.obtenerCitasPorEspecialidad);

module.exports = router;
