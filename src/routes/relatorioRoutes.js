const express = require('express')
const router = express.Router()
const { getDashboard } = require('../controllers/relatorioController')
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware')

router.get('/dashboard', authMiddleware, adminMiddleware, getDashboard)

module.exports = router