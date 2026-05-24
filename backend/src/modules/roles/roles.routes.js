const { Router } = require('express');
const controller = require('./roles.controller');
const { authMiddleware, soloRol } = require('../../middlewares/auth');

const router = Router();

router.get('/', authMiddleware, controller.listar);
router.get('/:id', authMiddleware, controller.obtenerPorId);
router.get('/:id/permisos', authMiddleware, controller.obtenerPermisos);
router.post('/', authMiddleware, soloRol('administrador'), controller.crear);
router.put('/:id', authMiddleware, soloRol('administrador'), controller.actualizar);
router.delete('/:id', authMiddleware, soloRol('administrador'), controller.eliminar);
router.put('/:id/permisos', authMiddleware, soloRol('administrador'), controller.actualizarPermisos);

module.exports = router;
