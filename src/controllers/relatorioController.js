const pool = require('../config/database')

const getDashboard = async (req, res, next) => {
  try {
    const totalAgendamentos = await pool.query('SELECT COUNT(*) FROM agendamentos')
    
    const servicosMaisSolicitados = await pool.query(`
      SELECT s.nome, COUNT(a.id) as total
      FROM agendamentos a
      JOIN servicos s ON a.servico_id = s.id
      GROUP BY s.nome
      ORDER BY total DESC
      LIMIT 5
    `)

    const profissionaisMaisRequisitados = await pool.query(`
      SELECT p.nome, COUNT(a.id) as total
      FROM agendamentos a
      JOIN profissionais p ON a.profissional_id = p.id
      GROUP BY p.nome
      ORDER BY total DESC
      LIMIT 5
    `)

    const agendamentosPorStatus = await pool.query(`
      SELECT sa.nome as status, COUNT(a.id) as total
      FROM agendamentos a
      JOIN status_agendamento sa ON a.status_id = sa.id
      GROUP BY sa.nome
    `)

    res.json({
      total_agendamentos: parseInt(totalAgendamentos.rows[0].count),
      servicos_mais_solicitados: servicosMaisSolicitados.rows,
      profissionais_mais_requisitados: profissionaisMaisRequisitados.rows,
      agendamentos_por_status: agendamentosPorStatus.rows
    })
  } catch (err) { next(err) }
}

module.exports = { getDashboard }