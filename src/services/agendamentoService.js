const agendamentoModel = require('../models/agendamentoModel')
const servicoModel = require('../models/servicoModel')

const listar = async (usuario_id, profissional_id, status_id) => {
  return await agendamentoModel.findAll(usuario_id, profissional_id, status_id)
}

const buscarPorId = async (id) => {
  const agendamento = await agendamentoModel.findById(id)
  if (!agendamento) throw { status: 404, message: 'Agendamento não encontrado' }
  return agendamento
}

const criar = async (usuario_id, profissional_id, servico_id, data_hora_inicio) => {
  if (!usuario_id || !profissional_id || !servico_id || !data_hora_inicio) {
    throw { status: 400, message: 'Todos os campos são obrigatórios' }
  }

  const servico = await servicoModel.findById(servico_id)
  if (!servico) throw { status: 404, message: 'Serviço não encontrado' }

  const inicio = new Date(data_hora_inicio)
  const fim = new Date(inicio.getTime() + servico.duracao_min * 60000)

  const conflito = await agendamentoModel.checkConflito(profissional_id, inicio, fim)
  if (conflito) throw { status: 409, message: 'Profissional já tem agendamento nesse horário' }

  const bloqueado = await agendamentoModel.checkHorarioBloqueado(profissional_id, inicio, fim)
  if (bloqueado) throw { status: 409, message: 'Horário bloqueado para este profissional' }

  return await agendamentoModel.create(usuario_id, profissional_id, servico_id, inicio, fim)
}

const cancelar = async (id, usuario_id, perfil) => {
  const agendamento = await agendamentoModel.findById(id)
  if (!agendamento) throw { status: 404, message: 'Agendamento não encontrado' }

  if (perfil !== 'admin' && agendamento.usuario_id !== usuario_id) {
    throw { status: 403, message: 'Sem permissão para cancelar este agendamento' }
  }

  const agora = new Date()
  const inicio = new Date(agendamento.data_hora_inicio)
  const diffHoras = (inicio - agora) / (1000 * 60 * 60)

  if (diffHoras < 2) throw { status: 400, message: 'Cancelamento só permitido com 2h de antecedência' }

  return await agendamentoModel.updateStatus(id, 'Cancelado')
}

const concluir = async (id) => {
  const agendamento = await agendamentoModel.findById(id)
  if (!agendamento) throw { status: 404, message: 'Agendamento não encontrado' }
  return await agendamentoModel.updateStatus(id, 'Concluido')
}

module.exports = { listar, buscarPorId, criar, cancelar, concluir }