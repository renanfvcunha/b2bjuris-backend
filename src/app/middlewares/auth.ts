import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import authConfig from '../../config/auth'

interface UserRequest extends Request {
  userId?: number
}

export default async (req: UserRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ msg: 'Token não enviado!' })
  }

  // Capturando token enviado
  const token = authHeader.split(' ')[1]

  // Verificando se o token enviado não foi alterado
  try {
    const decoded: any = jwt.verify(token, authConfig.secret)
    req.userId = decoded.id
    return next()
  } catch (err) {
    return res.status(401).json({ msg: 'Token inválido!' })
  }
}
