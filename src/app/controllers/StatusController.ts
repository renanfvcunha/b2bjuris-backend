import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import { Status } from '../models/Status'

import IStatus from '../interfaces/IStatus'

class StatusController {
  public async index (req: Request, res: Response) {
    const { tipo } = req.query
    try {
      let allStatus: Status[]

      if (tipo) {
        allStatus = await getRepository(Status).find({
          select: ['id', 'status'],
          where: { tipo }
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

  public async store (req: Request, res: Response) {
    const { tipo, status }: IStatus = req.body
    try {
      // Verifica se existe um status já cadastrado para um mesmo tipo
      const statusExists = await getRepository(Status).findOne({
        select: ['status'],
        where: { status, tipo }
      })
      if (statusExists) {
        return res.status(401).json({
          msg: 'Ops, este status já existe!'
        })
      }

      const novoStatus = new Status()
      novoStatus.tipo = tipo
      novoStatus.status = status

      await getRepository(Status).save(novoStatus)

      return res.json({
        msg: 'Status cadastrado com sucesso!'
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        msg:
          'Ops, erro interno do servidor. Tente novamente ou contate o suporte.'
      })
    }
  }
}

export default new StatusController()
