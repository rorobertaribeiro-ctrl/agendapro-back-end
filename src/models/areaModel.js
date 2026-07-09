const pool = require('../config/database')

const findAll = async () => {
  const result = await pool.query('SELECT * FROM areas')
  return result.rows
}

const findById = async (id) => {
  const result = await pool.query('SELECT * FROM areas WHERE id = $1', [id])
  return result.rows[0]
}

const create = async (nome, descricao) => {
  const result = await pool.query(
    'INSERT INTO areas (nome, descricao) VALUES ($1, $2) RETURNING *',
    [nome, descricao]
  )
  return result.rows[0]
}

const update = async (id, nome, descricao) => {
  const result = await pool.query(
    'UPDATE areas SET nome=$1, descricao=$2 WHERE id=$3 RETURNING *',
    [nome, descricao, id]
  )
  return result.rows[0]
}

const remove = async (id) => {
  const result = await pool.query('DELETE FROM areas WHERE id=$1 RETURNING *', [id])
  return result.rows[0]
}

module.exports = { findAll, findById, create, update, remove }