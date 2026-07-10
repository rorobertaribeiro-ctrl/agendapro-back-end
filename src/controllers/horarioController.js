const horarioService = require('../services/horarioService')

const listarHorarios = async (req, res, next) => {
  try { res.json(await horarioService.listarHorarios(req.params.profissional_id)) } catch (err) { next(err) }
}

const criarHorario = async (req, res, next) => {
  try {
    const { dia_semana, hora_inicio, hora_fim } = req.body
    res.status(201).json(await horarioService.criarHorario(req.params.profissional_id, dia_semana, hora_inicio, hora_fim))
  } catch (err) { next(err) }
}

const deletarHorario = async (req, res, next) => {
  try { res.json(await horarioService.deletarHorario(req.params.id)) } catch (err) { next(err) }
}

const listarBloqueios = async (req, res, next) => {
  try { res.json(await horarioService.listarBloqueios(req.params.profissional_id)) } catch (err) { next(err) }
}

const criarBloqueio = async (req, res, next) => {
  try {
    const { inicio, fim, motivo } = req.body
    res.status(201).json(await horarioService.criarBloqueio(req.params.profissional_id, inicio, fim, motivo))
  } catch (err) { next(err) }
}

const deletarBloqueio = async (req, res, next) => {
  try { res.json(await horarioService.deletarBloqueio(req.params.id)) } catch (err) { next(err) }
}

const getDisponibilidade = async (req, res, next) => {
  try {
    const { data, servico_id } = req.query
    res.json(await horarioService.getDisponibilidade(req.params.profissional_id, data, servico_id))
  } catch (err) { next(err) }
}

module.exports = { listarHorarios, criarHorario, deletarHorario, listarBloqueios, criarBloqueio, deletarBloqueio, getDisponibilidade }