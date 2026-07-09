const userService = require('../services/userService')

const cadastrar = async (req, res, next) => {
  try {
    const { nome, email, senha, perfil } = req.body
    const usuario = await userService.cadastrar(nome, email, senha, perfil)
    res.status(201).json(usuario)
  } catch (err) {
    next(err)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, senha } = req.body
    const resultado = await userService.login(email, senha)
    res.json(resultado)
  } catch (err) {
    next(err)
  }
}

module.exports = { cadastrar, login }