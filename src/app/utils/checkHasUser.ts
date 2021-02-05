import { Request, Response } from 'express'
import { getRepository } from 'typeorm'

import { Usuario } from '../models/Usuario'

export default async (req: Request, res: Response): Promise<Response> => {
  try {
    const hasUser = await getRepository(Usuario).findOne()

    if (!hasUser) {
      return res.json({ hasUser: false })
    }

    return res.json({ hasUser: true })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      msg: 'Erro interno do servidor. Tente novamente ou contate o suporte.'
    })
  }
}
