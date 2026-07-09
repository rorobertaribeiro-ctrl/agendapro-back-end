const profissionalModel = require('../models/profissionalModel')

const listar = async () => {
  return await profissionalModel.findAll()
}

const buscarPorId = async (id) => {
  const profissional = await profissionalModel.findById(id)
  if (!profissional) throw { status: 404, message: 'Profissional não encontrado' }
  return profissional
}

const criar = async (nome, especialidade, telefone) => {
  if (!nome) throw { status: 400, message: 'Nome é obrigatório' }
  return await profissionalModel.create(nome, especialidade, telefone)
}

const atualizar = async (id, nome, especialidade, telefone) => {
  if (!nome) throw { status: 400, message: 'Nome é obrigatório' }
  const profissional = await profissionalModel.update(id, nome, especialidade, telefone)
  if (!profissional) throw { status: 404, message: 'Profissional não encontrado' }
  return profissional
}

const deletar = async (id) => {
  const profissional = await profissionalModel.remove(id)
  if (!profissional) throw { status: 404, message: 'Profissional não encontrado' }
  return { mensagem: 'Profissional removido com sucesso' }
}

module.exports = { listar, buscarPorId, criar, atualizar, deletar }