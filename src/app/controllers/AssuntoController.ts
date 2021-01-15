import { Request, Response } from 'express'
import { getRepository } from 'typeorm'

import IAssunto from '../interfaces/IAssunto'
import { Assunto } from '../models/Assunto'

class AssuntoController {
  public async index (req: Request, res: Response) {
    try {
      const assuntos = await getRepository(Assunto).find()

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
      const { nome_assunto }: IAssunto = req.body

      const assunto = new Assunto()
      assunto.assunto = nome_assunto

      await getRepository(Assunto).save(assunto)

      return res.json({ msg: 'Assunto cadastrado com sucesso!' })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        msg: 'Erro interno do servidor. Tente novamente ou contate o suporte.'
      })
    }
  }
}

export default new AssuntoController()
