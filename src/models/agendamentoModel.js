const pool = require('../config/database')

const findAll = async (usuario_id, profissional_id, status_id) => {
  let query = `
    SELECT a.*, u.nome as usuario_nome, p.nome as profissional_nome,
    s.nome as servico_nome, sa.nome as status_nome
    FROM agendamentos a
    LEFT JOIN usuarios u ON a.usuario_id = u.id
    LEFT JOIN profissionais p ON a.profissional_id = p.id
    LEFT JOIN servicos s ON a.servico_id = s.id
    LEFT JOIN status_agendamento sa ON a.status_id = sa.id
    WHERE 1=1
  `
  const params = []
  if (usuario_id) { params.push(usuario_id); query += ` AND a.usuario_id = $${params.length}` }
  if (profissional_id) { params.push(profissional_id); query += ` AND a.profissional_id = $${params.length}` }
  if (status_id) { params.push(status_id); query += ` AND a.status_id = $${params.length}` }
  query += ' ORDER BY a.data_hora_inicio'
  const result = await pool.query(query, params)
  return result.rows
}

const findById = async (id) => {
  const result = await pool.query(`
    SELECT a.*, u.nome as usuario_nome, p.nome as profissional_nome,
    s.nome as servico_nome, sa.nome as status_nome
    FROM agendamentos a
    LEFT JOIN usuarios u ON a.usuario_id = u.id
    LEFT JOIN profissionais p ON a.profissional_id = p.id
    LEFT JOIN servicos s ON a.servico_id = s.id
    LEFT JOIN status_agendamento sa ON a.status_id = sa.id
    WHERE a.id = $1
  `, [id])
  return result.rows[0]
}

const checkConflito = async (profissional_id, data_hora_inicio, data_hora_fim, excluir_id = null) => {
  let query = `
    SELECT * FROM agendamentos
    WHERE profissional_id = $1
    AND status_id != (SELECT id FROM status_agendamento WHERE nome = 'Cancelado')
    AND (data_hora_inicio, data_hora_fim) OVERLAPS ($2::timestamp, $3::timestamp)
  `
  const params = [profissional_id, data_hora_inicio, data_hora_fim]
  if (excluir_id) { params.push(excluir_id); query += ` AND id != $${params.length}` }
  const result = await pool.query(query, params)
  return result.rows.length > 0
}

const checkHorarioBloqueado = async (profissional_id, data_hora_inicio, data_hora_fim) => {
  const result = await pool.query(`
    SELECT * FROM horarios_bloqueados
    WHERE profissional_id = $1
    AND (inicio, fim) OVERLAPS ($2::timestamp, $3::timestamp)
  `, [profissional_id, data_hora_inicio, data_hora_fim])
  return result.rows.length > 0
}

const create = async (usuario_id, profissional_id, servico_id, data_hora_inicio, data_hora_fim) => {
  const status = await pool.query("SELECT id FROM status_agendamento WHERE nome = 'Confirmado'")
  const result = await pool.query(`
    INSERT INTO agendamentos (usuario_id, profissional_id, servico_id, status_id, data_hora_inicio, data_hora_fim)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
  `, [usuario_id, profissional_id, servico_id, status.rows[0].id, data_hora_inicio, data_hora_fim])
  return result.rows[0]
}

const updateStatus = async (id, status_nome) => {
  const status = await pool.query('SELECT id FROM status_agendamento WHERE nome = $1', [status_nome])
  if (!status.rows[0]) throw { status: 400, message: 'Status inválido' }
  const result = await pool.query(
    'UPDATE agendamentos SET status_id=$1 WHERE id=$2 RETURNING *',
    [status.rows[0].id, id]
  )
  return result.rows[0]
}

module.exports = { findAll, findById, checkConflito, checkHorarioBloqueado, create, updateStatus }