const areaModel = require('../models/areaModel')

const listar = async () => await areaModel.findAll()

const buscarPorId = async (id) => {
  const area = await areaModel.findById(id)
  if (!area) throw { status: 404, message: 'Área não encontrada' }
  return area
}

const criar = async (nome, descricao) => {
  if (!nome) throw { status: 400, message: 'Nome é obrigatório' }
  return await areaModel.create(nome, descricao)
}

const atualizar = async (id, nome, descricao) => {
  if (!nome) throw { status: 400, message: 'Nome é obrigatório' }
  const area = await areaModel.update(id, nome, descricao)
  if (!area) throw { status: 404, message: 'Área não encontrada' }
  return area
}

const deletar = async (id) => {
  const area = await areaModel.remove(id)
  if (!area) throw { status: 404, message: 'Área não encontrada' }
  return { mensagem: 'Área removida com sucesso' }
}

module.exports = { listar, buscarPorId, criar, atualizar, deletar }