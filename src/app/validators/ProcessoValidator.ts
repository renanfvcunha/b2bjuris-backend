import { Express, Request, Response, NextFunction } from 'express'
import { unlink } from 'fs'
import { resolve } from 'path'
import { getRepository } from 'typeorm'

import IProcesso from '../interfaces/IProcesso'
import { Processo } from '../models/Processo'

function deleteFiles (req: Request) {
  if (req.files) {
    const docs: any = req.files

    const docNames: string[] = []

    docs.forEach((doc: Express.Multer.File) => {
      docNames.push(doc.filename)
    })

    docNames.forEach(doc =>
      unlink(resolve(__dirname, '..', '..', 'uploads', 'docs', doc), () => {})
    )
  }
}

class ProcessoValidator {
  public async store (req: Request, res: Response, next: NextFunction) {
    const { numero_processo }: IProcesso = req.body

    const numberExists = await getRepository(Processo).findOne({
      where: { numero_processo }
    })

    if (numberExists) {
      deleteFiles(req)
      return res
        .status(400)
        .json({ msg: 'Já existe um processo com o número informado.' })
    }

    return next()
  }
}

export default new ProcessoValidator()
