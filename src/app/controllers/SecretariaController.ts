import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import ISecretaria from '../interfaces/ISecretaria'

import { Secretaria } from '../models/Secretaria'

class SecretariaController {
  public async index (req: Request, res: Response) {
    const { per_page, page, search } = req.query

    try {
      if (page) {
        let secretarias: Secretaria[] = []
        let total: number

        // Verificando se o registro será filtrado ou não
        if (search) {
          secretarias = await getRepository(Secretaria)
            .createQueryBuilder('secretaria')
            .select(['secretaria.id', 'secretaria.secretaria'])
            .where('secretaria like :secretaria', {
              secretaria: '%' + search + '%'
            })
            .take(Number(per_page))
            .skip((Number(page) - 1) * Number(per_page))
            .orderBy('secretaria.id', 'DESC')
            .getMany()

          total = await getRepository(Secretaria)
            .createQueryBuilder()
            .select()
            .where('secretaria like :secretaria', {
              secretaria: '%' + search + '%'
            })
            .getCount()
        } else {
          secretarias = await getRepository(Secretaria)
            .createQueryBuilder('user')
            .select(['secretaria.id', 'secretaria.secretaria'])
            .take(Number(per_page))
            .skip((Number(page) - 1) * Number(per_page))
            .orderBy('secretaria.id', 'DESC')
            .getMany()

          total = await getRepository(Secretaria).count()
        }

        return res.json({ secretarias, total, page: Number(page) })
      } else {
        const secretarias = await getRepository(Secretaria).find({
          select: ['id', 'secretaria']
        })

        return res.json(secretarias)
      }
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        msg: 'Erro interno do servidor. Tente novamente ou contate o suporte.'
      })
    }
  }

  public async store (req: Request, res: Response) {
    const { secretaria }: ISecretaria = req.body

    try {
      // Verifica se não existe uma secretaria já cadastrada
      const secretariaQuery = await getRepository(Secretaria).findOne({
        select: ['secretaria'],
        where: { secretaria }
      })

      if (secretariaQuery) {
        return res.status(401).json({
          msg: 'Ops, esta Secretaria já existe!'
        })
      }

      const novaSecretaria = new Secretaria()

      novaSecretaria.secretaria = secretaria

      await getRepository(Secretaria).save(novaSecretaria)

      return res.json({ msg: 'Secretaria cadastrada com sucesso!' })
    } catch (err) {
      return res.status(500).json({
        msg:
          'Ops, erro interno do servidor. Tente novamente ou contate o suporte.'
      })
    }
  }
}

export default new SecretariaController()
