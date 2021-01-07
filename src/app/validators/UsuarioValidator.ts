import { Request, Response, NextFunction } from 'express'

interface IUser {
  nome?: string
  nome_usuario?: string
  tipo_usuario?: string
  senha?: string
  conf_senha?: string
}

class UsuarioValidator {
  public store (req: Request, res: Response, next: NextFunction) {
    const {
      nome,
      nome_usuario,
      tipo_usuario,
      senha,
      conf_senha
    }: IUser = req.body

    // Verificando se todos os campos estão preenchidos
    if (!nome || !nome_usuario || !tipo_usuario || !senha || !conf_senha) {
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
    const { nome, nome_usuario, senha, conf_senha }: IUser = req.body

    // Verificando se todos os campos estão preenchidos
    if (!nome || !nome_usuario || !senha || !conf_senha) {
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
}

export default new UsuarioValidator()
