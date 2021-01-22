import { Request, Response } from 'express'
import { getRepository } from 'typeorm'

import { Status } from '../models/Status'

class StatusController {
  public async index (req: Request, res: Response) {
    const { tipo } = req.query
    try {
      let allStatus: Status[]

      if (tipo) {
        allStatus = await getRepository(Status).find({
          select: ['id', 'status'],
          where: {
            tipo
          }
        })
      } else {
        allStatus = await getRepository(Status).find()
      }

      return res.json(allStatus)
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        msg: 'Erro interno do servidor. Tente novamente ou contate o suporte.'
      })
    }
  }
}

export default new StatusController()
