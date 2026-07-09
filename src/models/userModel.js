const pool = require('../config/database')

const findByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email])
  return result.rows[0]
}

const create = async (nome, email, senha_hash, perfil) => {
  const result = await pool.query(
    'INSERT INTO usuarios (nome, email, senha_hash, perfil) VALUES ($1, $2, $3, $4) RETURNING id, nome, email, perfil, criado_em',
    [nome, email, senha_hash, perfil]
  )
  return result.rows[0]
}

const findAll = async () => {
  const result = await pool.query('SELECT id, nome, email, perfil, criado_em FROM usuarios')
  return result.rows
}

module.exports = { findByEmail, create, findAll }