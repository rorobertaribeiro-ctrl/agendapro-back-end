const express = require('express')
const app = express()
require('dotenv').config()
require('./config/database')

const errorMiddleware = require('./middlewares/errorMiddleware')
const userRoutes = require('./routes/userRoutes')
const profissionalRoutes = require('./routes/profissionalRoutes')
const areaRoutes = require('./routes/areaRoutes')
const servicoRoutes = require('./routes/servicoRoutes')

app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'AgendaPro Beauty API rodando!' })
})

app.use('/usuarios', userRoutes)
app.use('/profissionais', profissionalRoutes)
app.use('/areas', areaRoutes)
app.use('/servicos', servicoRoutes)
app.use(errorMiddleware)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})

module.exports = app