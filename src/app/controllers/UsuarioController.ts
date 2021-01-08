import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import IUsuario from '../interfaces/IUsuario'
import { Usuario } from '../models/Usuario'
import authConfig from '../../config/auth'

class UsuarioController {
  public async store (req: Request, res: Response) {
    const {
      nome,
      nome_usuario,
      email,
      tipo_usuario,
      senha
    }: IUsuario = req.body

    try {
      // Verificando se não há usuário com mesmo username
      const usernameQuery = await getRepository(Usuario).findOne({
        select: ['nome_usuario'],
        where: { nome_usuario }
      })
      if (usernameQuery) {
        return res
          .status(400)
          .json({ msg: 'Já existe um usuário com este nome de usuário.' })
      }

      // Criptografando senha do usuario
      const hash_senha = await bcrypt.hash(senha, 8)

      // Adicionando usuário
      const usuario = new Usuario()
      usuario.nome = nome
      usuario.nome_usuario = nome_usuario
      usuario.email = email
      usuario.tipo_usuario = tipo_usuario
      usuario.senha = hash_senha

      await getRepository(Usuario).save(usuario)

      return res.json({ msg: 'Usuário Cadastrado Com Sucesso!' })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        msg: 'Erro interno do servidor. Tente novamente ou contate o suporte.'
      })
    }
  }

  public async storeFirstUser (req: Request, res: Response) {
    const { nome, nome_usuario, email, senha }: IUsuario = req.body

    try {
      // Verificando se não há usuários cadastrados
      const hasUser = await getRepository(Usuario).findOne()

      if (hasUser) {
        return res
          .status(403)
          .json({ msg: 'Já há usuário(s) cadastrado(s) no sistema.' })
      }

      // Criptografando senha do usuario
      const hash_senha = await bcrypt.hash(senha, 8)

      // Adicionando usuário
      const usuario = new Usuario()
      usuario.nome = nome
      usuario.nome_usuario = nome_usuario
      usuario.email = email
      usuario.tipo_usuario = 'admin'
      usuario.senha = hash_senha

      const newUser = await getRepository(Usuario).save(usuario)

      const { id, tipo_usuario } = newUser

      return res.json({
        user: { id, nome, tipo_usuario },
        token: jwt.sign({ id }, authConfig.secret, {
          expiresIn: '5m'
        })
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        msg: 'Erro interno do servidor. Tente novamente ou contate o suporte.'
      })
    }
  }
}

export default new UsuarioController()
