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
      const { nome_usuario, senha }: ISession = req.body

      // Buscando usuário no banco
      const usuario = await getRepository(Usuario)
        .createQueryBuilder('user')
        .where('nome_usuario = :nome_usuario', { nome_usuario })
        .orWhere('email = :nome_usuario', { nome_usuario })
        .getOne()

      const senhaUsuario = await bcrypt.compare(senha, usuario?.senha || '')

      // Verificando usuário e senha
      if (!usuario || !senhaUsuario) {
        return res.status(401).json({ msg: 'Usuário e/ou senha incorretos!' })
      }

      const { id, nome, tipo_usuario } = usuario

      // Retornando informações do usuário com o token de autenticação
      return res.json({
        user: { id, nome, tipo_usuario },
        token: jwt.sign({ id }, authConfig.secret, {
          expiresIn: '7d'
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
