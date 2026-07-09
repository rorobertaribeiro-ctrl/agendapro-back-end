const pool = require('../config/database')

const findAll = async () => {
  const result = await pool.query('SELECT * FROM profissionais WHERE ativo = true')
  return result.rows
}

const findById = async (id) => {
  const result = await pool.query('SELECT * FROM profissionais WHERE id = $1', [id])
  return result.rows[0]
}

const create = async (nome, especialidade, telefone) => {
  const result = await pool.query(
    'INSERT INTO profissionais (nome, especialidade, telefone) VALUES ($1, $2, $3) RETURNING *',
    [nome, especialidade, telefone]
  )
  return result.rows[0]
}

const update = async (id, nome, especialidade, telefone) => {
  const result = await pool.query(
    'UPDATE profissionais SET nome=$1, especialidade=$2, telefone=$3 WHERE id=$4 RETURNING *',
    [nome, especialidade, telefone, id]
  )
  return result.rows[0]
}

const remove = async (id) => {
  const result = await pool.query(
    'UPDATE profissionais SET ativo=false WHERE id=$1 RETURNING *',
    [id]
  )
  return result.rows[0]
}

module.exports = { findAll, findById, create, update, remove }