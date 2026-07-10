const horarioModel = require('../models/horarioModel')

const listarHorarios = async (profissional_id) => {
  return await horarioModel.findHorariosByProfissional(profissional_id)
}

const criarHorario = async (profissional_id, dia_semana, hora_inicio, hora_fim) => {
  if (dia_semana === undefined || !hora_inicio || !hora_fim) {
    throw { status: 400, message: 'Todos os campos são obrigatórios' }
  }
  return await horarioModel.createHorario(profissional_id, dia_semana, hora_inicio, hora_fim)
}

const deletarHorario = async (id) => {
  const horario = await horarioModel.deleteHorario(id)
  if (!horario) throw { status: 404, message: 'Horário não encontrado' }
  return { mensagem: 'Horário removido com sucesso' }
}

const listarBloqueios = async (profissional_id) => {
  return await horarioModel.findBloqueiosByProfissional(profissional_id)
}

const criarBloqueio = async (profissional_id, inicio, fim, motivo) => {
  if (!inicio || !fim) throw { status: 400, message: 'Início e fim são obrigatórios' }
  return await horarioModel.createBloqueio(profissional_id, inicio, fim, motivo)
}

const deletarBloqueio = async (id) => {
  const bloqueio = await horarioModel.deleteBloqueio(id)
  if (!bloqueio) throw { status: 404, message: 'Bloqueio não encontrado' }
  return { mensagem: 'Bloqueio removido com sucesso' }
}

const getDisponibilidade = async (profissional_id, data, servico_id) => {
  const servicoModel = require('../models/servicoModel')
  const servico = await servicoModel.findById(servico_id)
  if (!servico) throw { status: 404, message: 'Serviço não encontrado' }
  return await horarioModel.getDisponibilidade(profissional_id, data, servico.duracao_min)
}

module.exports = { listarHorarios, criarHorario, deletarHorario, listarBloqueios, criarBloqueio, deletarBloqueio, getDisponibilidade }