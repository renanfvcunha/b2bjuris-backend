import { Request, Response } from 'express'

import { getRepository } from 'typeorm'
import { TipoEncaminhamento } from '../models/TipoEncaminhamento'

class TipoEncaminhamentoController {
  public async index (req: Request, res: Response) {
    try {
      const tiposEncaminhamento = await getRepository(TipoEncaminhamento).find()

      return res.json(tiposEncaminhamento)
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        msg: 'Erro interno do servidor. Tente novamente ou contate o suporte.'
      })
    }
  }
}

export default new TipoEncaminhamentoController()
