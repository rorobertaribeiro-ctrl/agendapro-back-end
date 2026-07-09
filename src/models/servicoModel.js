const pool = require('../config/database')

const findAll = async (area_id) => {
  let query = 'SELECT s.*, a.nome as area_nome FROM servicos s LEFT JOIN areas a ON s.area_id = a.id'
  const params = []
  if (area_id) { query += ' WHERE s.area_id = $1'; params.push(area_id) }
  const result = await pool.query(query, params)
  return result.rows
}

const findById = async (id) => {
  const result = await pool.query(
    'SELECT s.*, a.nome as area_nome FROM servicos s LEFT JOIN areas a ON s.area_id = a.id WHERE s.id = $1',
    [id]
  )
  return result.rows[0]
}

const create = async (area_id, nome, duracao_min, preco) => {
  const result = await pool.query(
    'INSERT INTO servicos (area_id, nome, duracao_min, preco) VALUES ($1, $2, $3, $4) RETURNING *',
    [area_id, nome, duracao_min, preco]
  )
  return result.rows[0]
}

const update = async (id, area_id, nome, duracao_min, preco) => {
  const result = await pool.query(
    'UPDATE servicos SET area_id=$1, nome=$2, duracao_min=$3, preco=$4 WHERE id=$5 RETURNING *',
    [area_id, nome, duracao_min, preco, id]
  )
  return result.rows[0]
}

const remove = async (id) => {
  const result = await pool.query('DELETE FROM servicos WHERE id=$1 RETURNING *', [id])
  return result.rows[0]
}

module.exports = { findAll, findById, create, update, remove }