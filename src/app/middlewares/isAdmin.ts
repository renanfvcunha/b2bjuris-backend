import { Request, Response, NextFunction } from 'express'
import { getRepository } from 'typeorm'
import { Usuario } from '../models/Usuario'

interface UserRequest extends Request {
  userId?: number
}

export default async (
  req: UserRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id = req.userId

  const admin = await getRepository(Usuario).findOne(id, {
    where: [{ tipo_usuario: 'admin' }]
  })

  if (!admin) {
    return res.status(401).json({ msg: 'Usuário não autorizado!' })
  }

  return next()
}
