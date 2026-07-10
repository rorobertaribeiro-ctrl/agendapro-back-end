const express = require('express')
const router = express.Router()
const { listarHorarios, criarHorario, deletarHorario, listarBloqueios, criarBloqueio, deletarBloqueio, getDisponibilidade } = require('../controllers/horarioController')
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware')

router.get('/:profissional_id/horarios', listarHorarios)
router.post('/:profissional_id/horarios', authMiddleware, adminMiddleware, criarHorario)
router.delete('/:profissional_id/horarios/:id', authMiddleware, adminMiddleware, deletarHorario)
router.get('/:profissional_id/bloqueios', listarBloqueios)
router.post('/:profissional_id/bloqueios', authMiddleware, adminMiddleware, criarBloqueio)
router.delete('/:profissional_id/bloqueios/:id', authMiddleware, adminMiddleware, deletarBloqueio)
router.get('/:profissional_id/disponibilidade', getDisponibilidade)

module.exports = router