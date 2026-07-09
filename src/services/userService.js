const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')
const validateEmail = require('../utils/validateEmail')

const cadastrar = async (nome, email, senha, perfil = 'cliente') => {
  if (!nome || !email || !senha) throw { status: 400, message: 'Nome, email e senha são obrigatórios' }
  if (!validateEmail(email)) throw { status: 400, message: 'Email inválido' }

  const existe = await userModel.findByEmail(email)
  if (existe) throw { status: 400, message: 'Email já cadastrado' }

  const senha_hash = await bcrypt.hash(senha, 10)
  return await userModel.create(nome, email, senha_hash, perfil)
}

const login = async (email, senha) => {
  if (!email || !senha) throw { status: 400, message: 'Email e senha são obrigatórios' }

  const usuario = await userModel.findByEmail(email)
  if (!usuario) throw { status: 401, message: 'Email ou senha inválidos' }

  const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash)
  if (!senhaCorreta) throw { status: 401, message: 'Email ou senha inválidos' }

  const token = jwt.sign(
    { id: usuario.id, perfil: usuario.perfil },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

  return { token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil } }
}

module.exports = { cadastrar, login }