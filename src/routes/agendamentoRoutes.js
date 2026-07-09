const express = require('express')
const router = express.Router()
const { listar, buscarPorId, criar, cancelar, concluir } = require('../controllers/agendamentoController')
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware')

router.get('/', authMiddleware, listar)
router.get('/:id', authMiddleware, buscarPorId)
router.post('/', authMiddleware, criar)
router.patch('/:id/cancelar', authMiddleware, cancelar)
router.patch('/:id/concluir', authMiddleware, adminMiddleware, concluir)

module.exports = router