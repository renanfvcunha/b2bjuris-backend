import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import authConfig from '../../config/auth'

interface UserRequest extends Request {
  userId?: number
}

export default (req: UserRequest, res: Response) => {
  // Verificando se o token foi enviado no cabeçalho da requisição
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ msg: 'Token não enviado!' })
  }

  const token = authHeader.split(' ')[1]

  jwt.verify(token, authConfig.secret, err => {
    if (err) {
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ msg: 'Token Inválido!' })
      }
      if (err.name === 'TokenExpiredError') {
        return res
          .status(401)
          .json({ msg: 'Token Expirado! Faça login novamente.' })
      }
    }

    return res.json({ msg: 'Ok' })
  })
}
