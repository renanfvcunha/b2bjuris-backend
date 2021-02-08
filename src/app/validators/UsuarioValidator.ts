import { Request, Response, NextFunction } from 'express'
import IUsuario from '../interfaces/IUsuario'
class UsuarioValidator {
  public store (req: Request, res: Response, next: NextFunction) {
    const {
      nome,
      nome_usuario,
      email,
      tipo_usuario,
      senha,
      conf_senha
    }: IUsuario = req.body

    // Verificando se todos os campos estão preenchidos
    if (
      !nome ||
      !nome_usuario ||
      !email ||
      !tipo_usuario ||
      !senha ||
      !conf_senha
    ) {
      return res.status(400).json({
        msg: 'Verifique se todos os campos estão preenchidos corretamente!'
      })
    }

    // Verificando se senhas coincidem
    if (senha !== conf_senha) {
      return res.status(400).json({ msg: 'Senhas não coincidem!' })
    }

    // Verificando se não há espaços no nome de usuário
    const stringSpace = (string: string) => /\s/g.test(string)

    if (stringSpace(nome_usuario)) {
      return res
        .status(400)
        .json({ msg: 'Nome de usuário não pode conter espaços!' })
    }

    return next()
  }

  public storeFirstUser (req: Request, res: Response, next: NextFunction) {
    const { nome, nome_usuario, email, senha, conf_senha }: IUsuario = req.body

    // Verificando se todos os campos estão preenchidos
    if (!nome || !nome_usuario || !email || !senha || !conf_senha) {
      return res.status(400).json({
        msg: 'Verifique se todos os campos estão preenchidos corretamente!'
      })
    }

    // Verificando se senhas coincidem
    if (senha !== conf_senha) {
      return res.status(400).json({ msg: 'Senhas não coincidem!' })
    }

    // Verificando se não há espaços no nome de usuário
    const stringSpace = (string: string) => /\s/g.test(string)

    if (stringSpace(nome_usuario)) {
      return res
        .status(400)
        .json({ msg: 'Nome de usuário não pode conter espaços!' })
    }

    return next()
  }

  public async update (req: Request, res: Response, next: NextFunction) {
    const {
      nome,
      nome_usuario,
      tipo_usuario,
      senha,
      conf_senha
    }: IUsuario = req.body

    // Verificando se os campos obrigatórios estão preenchidos
    if (!nome || !nome_usuario || !tipo_usuario) {
      return res.status(400).json({
        msg:
          'Verifique se os campos obrigatórios estão preenchidos corretamente!'
      })
    }

    // Verificando se a senha será alterada e, caso sim, se coincidem.
    if (senha || conf_senha) {
      if (senha !== conf_senha) {
        return res.status(400).json({ msg: 'Senhas não coincidem!' })
      }
    }

    // Verificando se não há espaços no nome de usuário
    const stringSpace = (string: string) => /\s/g.test(string)

    if (stringSpace(nome_usuario)) {
      return res
        .status(400)
        .json({ msg: 'Nome de usuário não pode conter espaços!' })
    }

    return next()
  }
}

export default new UsuarioValidator()
