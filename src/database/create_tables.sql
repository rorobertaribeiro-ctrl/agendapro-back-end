CREATE TABLE IF NOT EXISTS areas (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT
);

CREATE TABLE IF NOT EXISTS profissionais (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  especialidade VARCHAR(100),
  telefone VARCHAR(20),
  ativo BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS servicos (
  id SERIAL PRIMARY KEY,
  area_id INT REFERENCES areas(id),
  nome VARCHAR(100) NOT NULL,
  duracao_min INT NOT NULL,
  preco DECIMAL(10,2)
);

CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  perfil VARCHAR(20) DEFAULT 'cliente',
  criado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS status_agendamento (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(50) NOT NULL,
  descricao TEXT
);

CREATE TABLE IF NOT EXISTS agendamentos (
  id SERIAL PRIMARY KEY,
  usuario_id INT REFERENCES usuarios(id),
  profissional_id INT REFERENCES profissionais(id),
  servico_id INT REFERENCES servicos(id),
  status_id INT REFERENCES status_agendamento(id),
  data_hora_inicio TIMESTAMP,
  data_hora_fim TIMESTAMP,
  criado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS horarios_trabalho (
  id SERIAL PRIMARY KEY,
  profissional_id INT REFERENCES profissionais(id),
  dia_semana INT NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL
);

CREATE TABLE IF NOT EXISTS horarios_bloqueados (
  id SERIAL PRIMARY KEY,
  profissional_id INT REFERENCES profissionais(id),
  inicio TIMESTAMP NOT NULL,
  fim TIMESTAMP NOT NULL,
  motivo TEXT
);

INSERT INTO status_agendamento (nome, descricao) VALUES
('Confirmado', 'Agendamento confirmado'),
('Cancelado', 'Agendamento cancelado'),
('Concluido', 'Atendimento concluído')
ON CONFLICT DO NOTHING;