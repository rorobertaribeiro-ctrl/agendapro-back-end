# AgendaPro Beauty — Back-end

API REST para gerenciamento de agendamentos de um salão de beleza: cadastro de clientes e administradores, áreas e serviços, profissionais, horários de trabalho, bloqueios de agenda, agendamentos com regras de negócio e relatórios gerenciais.

Projeto desenvolvido no âmbito da **Bolsa Futuro Digital (IFRS)**.

## Stack

- Node.js + Express
- PostgreSQL (via `pg`)
- JWT (`jsonwebtoken`) para autenticação
- `bcrypt` para hash de senha

## Estrutura do projeto

```
agendapro-back-end/
├── src/
│   ├── config/database.js        # conexão com o Postgres (Pool)
│   ├── controllers/               # camada HTTP (recebe req, chama service, responde)
│   ├── database/create_tables.sql # script de criação das tabelas
│   ├── middlewares/
│   │   ├── authMiddleware.js      # valida JWT e perfil admin
│   │   └── errorMiddleware.js     # tratamento centralizado de erros
│   ├── models/                    # acesso direto ao banco (queries SQL)
│   ├── routes/                    # definição das rotas Express
│   ├── services/                  # regras de negócio
│   ├── tests/users_api_test.rest  # coleção de testes manuais (REST Client)
│   └── utils/validateEmail.js
├── app.js
├── .env
└── .gitignore
```

**Fluxo de uma requisição:** `routes` → `middlewares` (auth/admin, quando aplicável) → `controllers` → `services` (regras de negócio) → `models` (SQL) → resposta JSON.

## Configuração e instalação

### 1. Pré-requisitos

- Node.js 18+
- PostgreSQL 13+

### 2. Clonar e instalar dependências

```bash
git clone https://github.com/rorobertaribeiro-ctrl/agendapro-back-end.git
cd agendapro-back-end
npm install
```

### 3. Criar o banco de dados

```bash
createdb agendapro
psql -d agendapro -f src/database/create_tables.sql
```

### 4. Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto (use `.env.example` como base):

```
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_NAME=agendapro

JWT_SECRET=uma_string_secreta_bem_grande
```

### 5. Rodar o servidor

```bash
npm run dev     # com nodemon, reinicia sozinho a cada alteração
# ou
npm start        # produção
```

O servidor sobe em `http://localhost:3000`.

## Autenticação

A maioria das rotas de escrita exige um token JWT enviado no header:

```
Authorization: Bearer <token>
```

O token é obtido no login (`POST /usuarios/login`) e expira em **7 dias**. Ele carrega `id` e `perfil` do usuário (`cliente` ou `admin`).

- Rotas marcadas como **admin** exigem `perfil = admin`, retornando `403` caso contrário.
- Rotas sem token retornam `401`.

## Modelo de erros

Todas as respostas de erro seguem o formato:

```json
{ "erro": "mensagem descritiva" }
```

| Status | Significado |
|---|---|
| 400 | Dados inválidos ou faltando |
| 401 | Token ausente ou inválido |
| 403 | Sem permissão (perfil incorreto ou não é o dono do recurso) |
| 404 | Recurso não encontrado |
| 409 | Conflito (horário já ocupado / bloqueado) |
| 500 | Erro interno |

---

## Endpoints

### Usuários — `/usuarios`

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | `/usuarios/cadastro` | — | Cria usuário. Perfil padrão `cliente`; pode enviar `perfil: "admin"` |
| POST | `/usuarios/login` | — | Autentica e retorna `{ token, usuario }` |

**Cadastro — body:**
```json
{ "nome": "Ana Paula", "email": "ana@email.com", "senha": "123456" }
```
Validações: nome, email e senha obrigatórios; email precisa ser válido; email não pode já existir (`400`).

**Login — body:**
```json
{ "email": "ana@email.com", "senha": "123456" }
```
Credenciais inválidas retornam `401` (mensagem genérica, sem indicar se o erro foi no email ou na senha).

---

### Áreas — `/areas`

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/areas` | — | Lista todas as áreas |
| GET | `/areas/:id` | — | Busca área por ID |
| POST | `/areas` | admin | Cria área |
| PUT | `/areas/:id` | admin | Atualiza área |
| DELETE | `/areas/:id` | admin | Remove área |

**Body (POST/PUT):**
```json
{ "nome": "Cabelo", "descricao": "Serviços de cabelo" }
```

---

### Profissionais — `/profissionais`

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/profissionais` | — | Lista profissionais |
| GET | `/profissionais/:id` | — | Busca profissional por ID |
| POST | `/profissionais` | admin | Cria profissional |
| PUT | `/profissionais/:id` | admin | Atualiza profissional |
| DELETE | `/profissionais/:id` | admin | Remove profissional |

**Body (POST/PUT):**
```json
{ "nome": "Ana Paula", "especialidade": "Cabelo", "telefone": "51999999999" }
```

---

### Serviços — `/servicos`

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/servicos` | — | Lista serviços. Filtro opcional `?area_id=` |
| GET | `/servicos/:id` | — | Busca serviço por ID |
| POST | `/servicos` | admin | Cria serviço |
| PUT | `/servicos/:id` | admin | Atualiza serviço |
| DELETE | `/servicos/:id` | admin | Remove serviço |

**Body (POST/PUT):**
```json
{ "area_id": 1, "nome": "Corte feminino", "duracao_min": 60, "preco": 80.00 }
```

`duracao_min` é usado para calcular o fim do agendamento e os slots de disponibilidade.

---

### Horários de trabalho e bloqueios — `/profissionais/:profissional_id/...`

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/profissionais/:profissional_id/horarios` | — | Lista horários de trabalho do profissional |
| POST | `/profissionais/:profissional_id/horarios` | admin | Cria horário de trabalho |
| DELETE | `/profissionais/:profissional_id/horarios/:id` | admin | Remove horário de trabalho |
| GET | `/profissionais/:profissional_id/bloqueios` | — | Lista bloqueios manuais |
| POST | `/profissionais/:profissional_id/bloqueios` | admin | Cria bloqueio manual (ex.: folga, consulta) |
| DELETE | `/profissionais/:profissional_id/bloqueios/:id` | admin | Remove bloqueio |
| GET | `/profissionais/:profissional_id/disponibilidade` | — | Calcula horários livres |

**Criar horário de trabalho — body:**
```json
{ "dia_semana": 1, "hora_inicio": "08:00", "hora_fim": "18:00" }
```
`dia_semana`: `0` (domingo) a `6` (sábado), no padrão do `Date.getDay()` do JavaScript.

**Criar bloqueio — body:**
```json
{ "inicio": "2026-07-16T08:00:00", "fim": "2026-07-16T12:00:00", "motivo": "Consulta médica" }
```

**Disponibilidade — query params:**
```
GET /profissionais/1/disponibilidade?data=2026-07-15&servico_id=1
```
Retorna uma lista de slots livres (`{ inicio, fim }`), calculados a partir do horário de trabalho do dia da semana correspondente, descontando agendamentos existentes e bloqueios manuais, em passos de 30 minutos.

> ⚠️ **Atenção ao testar:** se `data` ou `servico_id` não forem enviados, o endpoint ainda não trata esses casos com uma validação prévia — o comportamento observado deve ser conferido antes de considerar o endpoint pronto para produção.

---

### Agendamentos — `/agendamentos`

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/agendamentos` | logado | Lista agendamentos. Filtros opcionais `?usuario_id=&profissional_id=&status_id=` |
| GET | `/agendamentos/:id` | logado | Busca agendamento por ID |
| POST | `/agendamentos` | logado | Cria agendamento |
| PATCH | `/agendamentos/:id/cancelar` | logado | Cancela agendamento (dono do agendamento ou admin) |
| PATCH | `/agendamentos/:id/concluir` | admin | Marca agendamento como concluído |

**Criar agendamento — body:**
```json
{ "profissional_id": 1, "servico_id": 1, "data_hora_inicio": "2026-07-15T10:00:00" }
```
O `usuario_id` é extraído automaticamente do token (não é enviado no body).

**Regras de negócio:**
- `data_hora_fim` é calculado somando `duracao_min` do serviço ao `data_hora_inicio`.
- Retorna `409` se já existir agendamento conflitante para o profissional no mesmo intervalo.
- Retorna `409` se o intervalo estiver dentro de um bloqueio manual.
- **Cancelamento:** só o próprio cliente (dono do agendamento) ou um admin pode cancelar; cancelamento só é permitido com **2 horas ou mais** de antecedência do horário marcado (`400` caso contrário).
- **Conclusão:** apenas admin pode marcar um agendamento como concluído.

---

### Relatórios — `/relatorios`

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/relatorios/dashboard` | admin | Retorna métricas gerais do salão |

**Resposta:**
```json
{
  "total_agendamentos": 42,
  "servicos_mais_solicitados": [{ "nome": "Corte feminino", "total": "15" }],
  "profissionais_mais_requisitados": [{ "nome": "Ana Paula", "total": "20" }],
  "agendamentos_por_status": [{ "status": "Confirmado", "total": "30" }]
}
```
`servicos_mais_solicitados` e `profissionais_mais_requisitados` retornam os **5 primeiros**, ordenados por total de agendamentos.

---

## Testando a API

O arquivo [`src/tests/users_api_test.rest`](./src/tests/users_api_test.rest) contém uma coleção completa de requisições prontas (sucesso e erro) para todos os módulos, usável com a extensão **REST Client** do VS Code (ou importável no Insomnia/Postman). Basta ajustar as variáveis `@adminToken` e `@clienteToken` no topo do arquivo após fazer login.

## Roadmap

- [ ] Reagendamento de horários (alterar `data_hora_inicio`/`profissional_id` de um agendamento já criado, reaplicando as validações de conflito e bloqueio)
- [ ] Validação explícita de parâmetros obrigatórios em `/disponibilidade`
- [ ] Testes automatizados (atualmente a suíte é manual, via `.rest`)

## Autor

Desenvolvido por Roberta Ribeiro — Bolsa Futuro Digital (IFRS).
