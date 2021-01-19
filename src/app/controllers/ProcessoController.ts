import { Express, Request, Response } from 'express'
import { getRepository } from 'typeorm'

import IAdministrativo from '../interfaces/IAdministrativo'
import IJudicial from '../interfaces/IJudicial'
import IOficio from '../interfaces/IOficio'
import IProcesso from '../interfaces/IProcesso'
import { Administrativo } from '../models/Administrativo'
import { Judicial } from '../models/Judicial'
import { Oficio } from '../models/Oficio'
import { Processo } from '../models/Processo'

interface IArquivo {
  nome: string
}

class ProcessoController {
  public async index (req: Request, res: Response) {
    const { page, per_page, search } = req.query

    try {
      if (page) {
        let processosQuery: Processo[] = []
        let total: number

        // Verificando se registro será ou não filtrado
        if (search) {
          processosQuery = await getRepository(Processo)
            .createQueryBuilder('processo')
            .leftJoinAndSelect('processo.status', 'status')
            .where('numero_processo like :numero_processo', {
              numero_processo: '%' + search + '%'
            })
            .orWhere('nome_parte like :nome_parte', {
              nome_parte: '%' + search + '%'
            })
            .orWhere('tipo_processo like :tipo_processo', {
              tipo_processo: '%' + search + '%'
            })
            .take(Number(per_page))
            .skip((Number(page) - 1) * Number(per_page))
            .orderBy('processo.id', 'DESC')
            .getMany()

          total = await getRepository(Processo)
            .createQueryBuilder()
            .select()
            .where('numero_processo like :numero_processo', {
              numero_processo: '%' + search + '%'
            })
            .orWhere('nome_parte like :nome_parte', {
              nome_parte: '%' + search + '%'
            })
            .orWhere('tipo_processo like :tipo_processo', {
              tipo_processo: '%' + search + '%'
            })
            .getCount()
        } else {
          processosQuery = await getRepository(Processo)
            .createQueryBuilder('processo')
            .leftJoinAndSelect('processo.status', 'status')
            .take(Number(per_page))
            .skip((Number(page) - 1) * Number(per_page))
            .orderBy('processo.id', 'DESC')
            .getMany()

          total = await getRepository(Processo).count()
        }

        const processos = processosQuery.map(processo => ({
          ...processo,
          status: processo.status?.status || null
        }))

        return res.json({ processos, total, page: Number(page) })
      } else {
        const processosQuery = await getRepository(Processo).find({
          relations: ['status']
        })

        const processos = processosQuery.map(processo => ({
          ...processo,
          status: processo.status?.status
        }))

        return res.json(processos)
      }
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        msg: 'Erro interno do servidor. Tente novamente ou contate o suporte.'
      })
    }
  }

  public async references (req: Request, res: Response) {
    try {
      const processos = await getRepository(Processo).find({
        select: ['id', 'numero_processo', 'nome_parte'],
        where: [
          { tipo_processo: 'administrativo' },
          { tipo_processo: 'judicial' }
        ]
      })

      return res.json(processos)
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        msg: 'Erro interno do servidor. Tente novamente ou contate o suporte.'
      })
    }
  }

  public async store (req: Request, res: Response) {
    try {
      const {
        numero_processo,
        nome_parte,
        tipo_processo,
        assunto
      }: IProcesso = req.body
      const docs: any = req.files

      const docNames: IArquivo[] = []

      if (docs) {
        docs.forEach((doc: Express.Multer.File) => {
          docNames.push({ nome: doc.filename })
        })
      }

      const processo = new Processo()
      processo.numero_processo = numero_processo
      processo.nome_parte = nome_parte
      processo.tipo_processo = tipo_processo
      processo.assunto = { id: assunto }
      processo.arquivo = docNames

      await getRepository(Processo).save(processo)

      if (tipo_processo === 'administrativo') {
        const {
          matricula,
          cpf,
          endereco,
          numero,
          complemento,
          bairro,
          cidade,
          uf,
          telefone,
          observacoes
        }: IAdministrativo = req.body

        const administrativo = new Administrativo()
        administrativo.processo = processo
        administrativo.matricula = matricula
        administrativo.cpf = cpf
        administrativo.endereco = endereco
        administrativo.numero = numero
        administrativo.complemento = complemento
        administrativo.bairro = bairro
        administrativo.cidade = cidade
        administrativo.uf = uf
        administrativo.telefone = telefone
        administrativo.observacoes = observacoes

        await getRepository(Administrativo).save(administrativo)
      } else if (tipo_processo === 'oficio') {
        const { processo_ref, secretaria }: IOficio = req.body

        const oficio = new Oficio()
        oficio.processo = processo
        oficio.id_processo_ref = processo_ref
        oficio.secretaria = { id: secretaria }

        await getRepository(Oficio).save(oficio)
      } else if (tipo_processo === 'judicial') {
        const { tipo_acao, polo_passivo, valor_causa }: IJudicial = req.body

        const judicial = new Judicial()
        judicial.processo = processo
        judicial.tipo_acao = { id: tipo_acao }
        judicial.polo_passivo = polo_passivo
        judicial.valor_causa = valor_causa

        await getRepository(Judicial).save(judicial)
      } else {
        await getRepository(Processo).delete(processo.id || 0)
        return res.status(400).json({ msg: 'Tipo de processo inválido!' })
      }

      return res.json({ msg: 'Processo cadastrado com sucesso!' })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        msg: 'Erro interno do servidor. Tente novamente ou contate o suporte.'
      })
    }
  }
}

export default new ProcessoController()
