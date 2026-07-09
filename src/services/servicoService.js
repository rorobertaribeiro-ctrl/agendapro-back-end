const servicoModel = require('../models/servicoModel')

const listar = async (area_id) => await servicoModel.findAll(area_id)

const buscarPorId = async (id) => {
  const servico = await servicoModel.findById(id)
  if (!servico) throw { status: 404, message: 'Serviço não encontrado' }
  return servico
}

const criar = async (area_id, nome, duracao_min, preco) => {
  if (!nome || !duracao_min) throw { status: 400, message: 'Nome e duração são obrigatórios' }
  return await servicoModel.create(area_id, nome, duracao_min, preco)
}

const atualizar = async (id, area_id, nome, duracao_min, preco) => {
  if (!nome || !duracao_min) throw { status: 400, message: 'Nome e duração são obrigatórios' }
  const servico = await servicoModel.update(id, area_id, nome, duracao_min, preco)
  if (!servico) throw { status: 404, message: 'Serviço não encontrado' }
  return servico
}

const deletar = async (id) => {
  const servico = await servicoModel.remove(id)
  if (!servico) throw { status: 404, message: 'Serviço não encontrado' }
  return { mensagem: 'Serviço removido com sucesso' }
}

module.exports = { listar, buscarPorId, criar, atualizar, deletar }