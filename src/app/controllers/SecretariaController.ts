import { Request, Response } from 'express'
import { getRepository } from 'typeorm'

import { Secretaria } from '../models/Secretaria'

class SecretariaController {
  public async index (req: Request, res: Response) {
    try {
      const secretarias = await getRepository(Secretaria).find()

      return res.json(secretarias)
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        msg: 'Erro interno do servidor. Tente novamente ou contate o suporte.'
      })
    }
  }
}

export default new SecretariaController()
