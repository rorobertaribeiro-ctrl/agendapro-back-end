const pool = require('../config/database')

const findHorariosByProfissional = async (profissional_id) => {
  const result = await pool.query(
    'SELECT * FROM horarios_trabalho WHERE profissional_id = $1 ORDER BY dia_semana',
    [profissional_id]
  )
  return result.rows
}

const createHorario = async (profissional_id, dia_semana, hora_inicio, hora_fim) => {
  const result = await pool.query(
    'INSERT INTO horarios_trabalho (profissional_id, dia_semana, hora_inicio, hora_fim) VALUES ($1, $2, $3, $4) RETURNING *',
    [profissional_id, dia_semana, hora_inicio, hora_fim]
  )
  return result.rows[0]
}

const deleteHorario = async (id) => {
  const result = await pool.query('DELETE FROM horarios_trabalho WHERE id=$1 RETURNING *', [id])
  return result.rows[0]
}

const findBloqueiosByProfissional = async (profissional_id) => {
  const result = await pool.query(
    'SELECT * FROM horarios_bloqueados WHERE profissional_id = $1 ORDER BY inicio',
    [profissional_id]
  )
  return result.rows
}

const createBloqueio = async (profissional_id, inicio, fim, motivo) => {
  const result = await pool.query(
    'INSERT INTO horarios_bloqueados (profissional_id, inicio, fim, motivo) VALUES ($1, $2, $3, $4) RETURNING *',
    [profissional_id, inicio, fim, motivo]
  )
  return result.rows[0]
}

const deleteBloqueio = async (id) => {
  const result = await pool.query('DELETE FROM horarios_bloqueados WHERE id=$1 RETURNING *', [id])
  return result.rows[0]
}

const getDisponibilidade = async (profissional_id, data, duracao_min) => {
  const dataObj = new Date(data)
  const diaSemana = dataObj.getDay()

  const horarios = await pool.query(
    'SELECT * FROM horarios_trabalho WHERE profissional_id = $1 AND dia_semana = $2',
    [profissional_id, diaSemana]
  )

  if (horarios.rows.length === 0) return []

  const horario = horarios.rows[0]
  const slots = []
  const dataStr = dataObj.toISOString().split('T')[0]

  let atual = new Date(`${dataStr}T${horario.hora_inicio}`)
  const fim = new Date(`${dataStr}T${horario.hora_fim}`)

  while (atual < fim) {
    const slotFim = new Date(atual.getTime() + duracao_min * 60000)
    if (slotFim > fim) break

    const conflito = await pool.query(`
      SELECT * FROM agendamentos
      WHERE profissional_id = $1
      AND status_id != (SELECT id FROM status_agendamento WHERE nome = 'Cancelado')
      AND (data_hora_inicio, data_hora_fim) OVERLAPS ($2::timestamp, $3::timestamp)
    `, [profissional_id, atual, slotFim])

    const bloqueio = await pool.query(`
      SELECT * FROM horarios_bloqueados
      WHERE profissional_id = $1
      AND (inicio, fim) OVERLAPS ($2::timestamp, $3::timestamp)
    `, [profissional_id, atual, slotFim])

    if (conflito.rows.length === 0 && bloqueio.rows.length === 0) {
      slots.push({
        inicio: atual.toISOString(),
        fim: slotFim.toISOString()
      })
    }

    atual = new Date(atual.getTime() + 30 * 60000)
  }

  return slots
}

module.exports = {
  findHorariosByProfissional, createHorario, deleteHorario,
  findBloqueiosByProfissional, createBloqueio, deleteBloqueio, getDisponibilidade
}