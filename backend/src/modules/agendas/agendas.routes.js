const { Router } = require('express');
const controller = require('./agendas.controller');
const { authMiddleware, soloRol } = require('../../middlewares/auth');

const router = Router();

router.use(authMiddleware);

router.get('/', soloRol('administrador', 'medico'), controller.listar);
router.post('/', soloRol('administrador'), controller.crear);
router.put('/:id', soloRol('administrador'), controller.actualizar);
router.delete('/:id', soloRol('administrador'), controller.eliminar);

module.exports = router;
