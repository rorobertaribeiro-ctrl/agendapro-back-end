const areaService = require('../services/areaService')

const listar = async (req, res, next) => {
  try { res.json(await areaService.listar()) } catch (err) { next(err) }
}

const buscarPorId = async (req, res, next) => {
  try { res.json(await areaService.buscarPorId(req.params.id)) } catch (err) { next(err) }
}

const criar = async (req, res, next) => {
  try {
    const { nome, descricao } = req.body
    res.status(201).json(await areaService.criar(nome, descricao))
  } catch (err) { next(err) }
}

const atualizar = async (req, res, next) => {
  try {
    const { nome, descricao } = req.body
    res.json(await areaService.atualizar(req.params.id, nome, descricao))
  } catch (err) { next(err) }
}

const deletar = async (req, res, next) => {
  try { res.json(await areaService.deletar(req.params.id)) } catch (err) { next(err) }
}

module.exports = { listar, buscarPorId, criar, atualizar, deletar }