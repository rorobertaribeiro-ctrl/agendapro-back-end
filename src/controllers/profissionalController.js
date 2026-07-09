const profissionalService = require('../services/profissionalService')

const listar = async (req, res, next) => {
  try {
    const profissionais = await profissionalService.listar()
    res.json(profissionais)
  } catch (err) { next(err) }
}

const buscarPorId = async (req, res, next) => {
  try {
    const profissional = await profissionalService.buscarPorId(req.params.id)
    res.json(profissional)
  } catch (err) { next(err) }
}

const criar = async (req, res, next) => {
  try {
    const { nome, especialidade, telefone } = req.body
    const profissional = await profissionalService.criar(nome, especialidade, telefone)
    res.status(201).json(profissional)
  } catch (err) { next(err) }
}

const atualizar = async (req, res, next) => {
  try {
    const { nome, especialidade, telefone } = req.body
    const profissional = await profissionalService.atualizar(req.params.id, nome, especialidade, telefone)
    res.json(profissional)
  } catch (err) { next(err) }
}

const deletar = async (req, res, next) => {
  try {
    const resultado = await profissionalService.deletar(req.params.id)
    res.json(resultado)
  } catch (err) { next(err) }
}

module.exports = { listar, buscarPorId, criar, atualizar, deletar }