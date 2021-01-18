import { Request, Response } from 'express'
import { getRepository } from 'typeorm'

import ITipoAcao from '../interfaces/ITipoAcao'
import { TipoAcao } from '../models/TipoAcao'

class TipoAcaoController {
  public async index (req: Request, res: Response) {
    try {
      const assuntos = await getRepository(TipoAcao).find()

      return res.json(assuntos)
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        msg: 'Erro interno do servidor. Tente novamente ou contate o suporte.'
      })
    }
  }

  public async store (req: Request, res: Response) {
    try {
      const { tipo_acao }: ITipoAcao = req.body

      const tipoAcao = new TipoAcao()
      tipoAcao.tipo_acao = tipo_acao

      await getRepository(TipoAcao).save(tipoAcao)

      return res.json({ msg: 'Assunto cadastrado com sucesso!' })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        msg: 'Erro interno do servidor. Tente novamente ou contate o suporte.'
      })
    }
  }
}

export default new TipoAcaoController()
