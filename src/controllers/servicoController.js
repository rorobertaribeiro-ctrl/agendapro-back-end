const servicoService = require('../services/servicoService')

const listar = async (req, res, next) => {
  try { res.json(await servicoService.listar(req.query.area_id)) } catch (err) { next(err) }
}

const buscarPorId = async (req, res, next) => {
  try { res.json(await servicoService.buscarPorId(req.params.id)) } catch (err) { next(err) }
}

const criar = async (req, res, next) => {
  try {
    const { area_id, nome, duracao_min, preco } = req.body
    res.status(201).json(await servicoService.criar(area_id, nome, duracao_min, preco))
  } catch (err) { next(err) }
}

const atualizar = async (req, res, next) => {
  try {
    const { area_id, nome, duracao_min, preco } = req.body
    res.json(await servicoService.atualizar(req.params.id, area_id, nome, duracao_min, preco))
  } catch (err) { next(err) }
}

const deletar = async (req, res, next) => {
  try { res.json(await servicoService.deletar(req.params.id)) } catch (err) { next(err) }
}

module.exports = { listar, buscarPorId, criar, atualizar, deletar }