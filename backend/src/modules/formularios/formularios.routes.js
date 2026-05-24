const { Router } = require('express');
const controller = require('./formularios.controller');
const { authMiddleware, soloRol } = require('../../middlewares/auth');

const router = Router();

router.get('/', authMiddleware, controller.listar);
router.post('/', authMiddleware, soloRol('administrador'), controller.crear);
router.put('/:id', authMiddleware, soloRol('administrador'), controller.actualizar);
router.delete('/:id', authMiddleware, soloRol('administrador'), controller.eliminar);

module.exports = router;
