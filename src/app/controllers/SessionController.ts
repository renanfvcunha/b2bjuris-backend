import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { Usuario } from '../models/Usuario'
import ISession from '../interfaces/ISession'
import authConfig from '../../config/auth'

class SessionController {
  public async store (req: Request, res: Response) {
    try {
      const { nome_usuario, senha, lembrar }: ISession = req.body

      let expireToken: string

      if (lembrar) {
        expireToken = '7d'
      } else {
        expireToken = '12h'
      }

      // Buscando usuário no banco
      const usuario = await getRepository(Usuario)
        .createQueryBuilder('user')
        .where('nome_usuario = :nome_usuario', { nome_usuario })
        .getOne()

      // Verificando se usuário não existe
      if (!usuario) {
        return res.status(404).json({ msg: 'Usuário não encontrado!' })
      }

      // Verificando se a senha está incorreta
      const senhaUsuario = await bcrypt.compare(senha, usuario.senha || '')

      if (!senhaUsuario) {
        return res.status(401).json({ msg: 'Senha incorreta!' })
      }

      const { id, nome, tipo_usuario } = usuario

      // Retornando informações do usuário com o token de autenticação
      return res.json({
        user: { id, nome, tipo_usuario },
        token: jwt.sign({ id }, authConfig.secret, {
          expiresIn: expireToken
        })
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        msg:
          'Erro interno do servidor. Por favor, tente novamente ou contate o suporte.'
      })
    }
  }
}

export default new SessionController()
