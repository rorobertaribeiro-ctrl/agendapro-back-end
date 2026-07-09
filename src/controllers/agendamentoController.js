const agendamentoService = require('../services/agendamentoService')

const listar = async (req, res, next) => {
  try {
    const { usuario_id, profissional_id, status_id } = req.query
    res.json(await agendamentoService.listar(usuario_id, profissional_id, status_id))
  } catch (err) { next(err) }
}

const buscarPorId = async (req, res, next) => {
  try { res.json(await agendamentoService.buscarPorId(req.params.id)) } catch (err) { next(err) }
}

const criar = async (req, res, next) => {
  try {
    const { profissional_id, servico_id, data_hora_inicio } = req.body
    const agendamento = await agendamentoService.criar(
      req.usuario.id, profissional_id, servico_id, data_hora_inicio
    )
    res.status(201).json(agendamento)
  } catch (err) { next(err) }
}

const cancelar = async (req, res, next) => {
  try {
    const resultado = await agendamentoService.cancelar(
      req.params.id, req.usuario.id, req.usuario.perfil
    )
    res.json(resultado)
  } catch (err) { next(err) }
}

const concluir = async (req, res, next) => {
  try { res.json(await agendamentoService.concluir(req.params.id)) } catch (err) { next(err) }
}

module.exports = { listar, buscarPorId, criar, cancelar, concluir }