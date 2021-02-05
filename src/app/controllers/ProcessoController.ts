import { Express, Request, Response } from 'express'
import { getRepository } from 'typeorm'

import IAdministrativo from '../interfaces/IAdministrativo'
import IJudicial from '../interfaces/IJudicial'
import IOficio from '../interfaces/IOficio'
import IProcesso from '../interfaces/IProcesso'
import { Administrativo } from '../models/Administrativo'
import { Arquivo } from '../models/Arquivo'
import { Historico } from '../models/Historico'
import { Judicial } from '../models/Judicial'
import { Observacoes } from '../models/Observacoes'
import { Oficio } from '../models/Oficio'
import { Processo } from '../models/Processo'
import { Usuario } from '../models/Usuario'

interface UserRequest extends Request {
  userId?: number
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
          finalizado: processo.finalizado ? 'Sim' : 'Não',
          status: processo.status?.status || 'Sem Status'
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

  public async show (req: Request, res: Response) {
    const { id } = req.params

    try {
      const processoQuery = await getRepository(Processo)
        .createQueryBuilder('processo')
        .select([
          'processo.numero_processo',
          'processo.nome_parte',
          'processo.tipo_processo',
          'observacoes.id',
          'observacoes.observacoes',
          'observacoes_usuario.nome',
          'status.id',
          'status.status',
          'arquivo.id',
          'arquivo.nome',
          'historico',
          'historico_usuario.nome',
          'assunto.assunto',
          'encaminhamento.id',
          'encaminhamento.recebido',
          'encaminhamento_usuario.nome',
          'administrativo',
          'judicial',
          'tipo_acao.tipo_acao',
          'oficio',
          'processo_ref.numero_processo',
          'secretaria.secretaria'
        ])
        .leftJoin('processo.observacoes', 'observacoes')
        .leftJoin('observacoes.usuario', 'observacoes_usuario')
        .leftJoin('processo.status', 'status')
        .leftJoin('processo.arquivo', 'arquivo')
        .leftJoin('processo.historico', 'historico')
        .leftJoin('historico.usuario', 'historico_usuario')
        .leftJoin('processo.assunto', 'assunto')
        .leftJoin('processo.encaminhamento', 'encaminhamento')
        .leftJoin('encaminhamento.usuario', 'encaminhamento_usuario')
        .leftJoin('processo.administrativo', 'administrativo')
        .leftJoin('processo.judicial', 'judicial')
        .leftJoin('judicial.tipo_acao', 'tipo_acao')
        .leftJoin('processo.oficio', 'oficio')
        .leftJoin('oficio.processo_ref', 'processo_ref')
        .leftJoin('oficio.secretaria', 'secretaria')
        .where('processo.id = :id', { id })
        .orderBy('historico.created_at', 'ASC')
        .getOne()

      const processo = {
        ...processoQuery
      }
      if (processoQuery) {
        if (processo.arquivo) {
          const novoArquivo = processo.arquivo.map(arquivo => ({
            ...arquivo,
            url: `${process.env.APP_URL}/docs/${arquivo.nome}`
          }))

          processo.arquivo = novoArquivo
        }
        if (processoQuery.tipo_processo === 'administrativo') {
          processo.tipo_processo = 'Administrativo'
          processo.judicial = undefined
          processo.oficio = undefined
        }
        if (processoQuery.tipo_processo === 'judicial') {
          processo.tipo_processo = 'Judicial'
          processo.administrativo = undefined
          processo.oficio = undefined
        }
        if (processoQuery.tipo_processo === 'oficio') {
          processo.tipo_processo = 'Ofício'
          processo.administrativo = undefined
          processo.judicial = undefined
        }
      }

      return res.json(processo)
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        msg: 'Erro interno do servidor. Tente novamente ou contate o suporte.'
      })
    }
  }

  public async store (req: UserRequest, res: Response) {
    try {
      const {
        numero_processo,
        nome_parte,
        tipo_processo,
        assunto,
        observacoes
      }: IProcesso = req.body
      const userId = req.userId
      const docs: any = req.files

      const docNames: Arquivo[] = []

      if (docs) {
        docs.forEach((doc: Express.Multer.File) => {
          docNames.push({ usuario: { id: userId }, nome: doc.filename })
        })
      }

      const processo = new Processo()
      processo.numero_processo = numero_processo
      processo.nome_parte = nome_parte
      processo.tipo_processo = tipo_processo
      processo.assunto = { id: assunto }
      processo.observacoes = [
        {
          usuario: { id: userId },
          observacoes
        }
      ]
      processo.arquivo = docNames
      processo.historico = [
        {
          usuario: { id: userId },
          descricao: 'Processo gerado'
        }
      ]

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
          telefone
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

        await getRepository(Administrativo)
          .save(administrativo)
          .catch(async () => {
            await getRepository(Processo).delete(processo.id || 0)
          })
      } else if (tipo_processo === 'oficio') {
        const { processo_ref, secretaria }: IOficio = req.body

        const oficio = new Oficio()
        oficio.processo = processo
        oficio.processo_ref = { id: processo_ref }
        oficio.secretaria = { id: secretaria }

        await getRepository(Oficio)
          .save(oficio)
          .catch(async () => {
            await getRepository(Processo).delete(processo.id || 0)
          })
      } else if (tipo_processo === 'judicial') {
        const { tipo_acao, polo_passivo, valor_causa }: IJudicial = req.body

        const judicial = new Judicial()
        judicial.processo = processo
        judicial.tipo_acao = { id: tipo_acao }
        judicial.polo_passivo = polo_passivo
        judicial.valor_causa = valor_causa

        await getRepository(Judicial)
          .save(judicial)
          .catch(async () => {
            await getRepository(Processo).delete(processo.id || 0)
          })
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

  public async updateByProc (req: UserRequest, res: Response) {
    const { id } = req.params
    const userId = req.userId
    const { status, observacoes } = req.body
    const docs: any = req.files

    const docNames: Arquivo[] = []

    try {
      /** Verificando se usuário que está editando o processo é o mesmo para
       * qual o processo foi encaminhado.
       */
      const verifyEnc = await getRepository(Processo)
        .createQueryBuilder('processo')
        .select(['processo.id', 'encaminhamento.id'])
        .leftJoin('processo.encaminhamento', 'encaminhamento')
        .leftJoin('encaminhamento.usuario', 'encaminhamento_usuario')
        .where('processo.id = :id', { id })
        .andWhere('encaminhamento_usuario.id = :userId', { userId })
        .getOne()

      if (!verifyEnc) {
        return res.status(403).json({
          msg:
            'Não é possível alterar um processo que não foi encaminhado para você.'
        })
      }

      /** Buscando procurador que está editando o processo */
      const procurador = await getRepository(Usuario).findOne({
        where: { id: userId }
      })

      const processo = new Processo()
      if (status !== '0') {
        processo.status = { id: Number(status) }
      } else {
        processo.status = null
      }

      await getRepository(Processo)
        .update(id, processo)
        .then(async () => {
          if (docs) {
            docs.forEach((doc: Express.Multer.File) => {
              docNames.push({
                processo: { id: Number(id) },
                usuario: { id: userId },
                nome: doc.filename
              })
            })

            await getRepository(Arquivo)
              .save(docNames)
              .catch(async () => {
                await getRepository(Processo).delete(id)
              })
          }

          if (observacoes) {
            const obs = new Observacoes()
            obs.processo = { id: Number(id) }
            obs.usuario = { id: userId }
            obs.observacoes = observacoes

            await getRepository(Observacoes)
              .save(obs)
              .catch(async () => {
                await getRepository(Processo).delete(id)
              })
          }

          const hist = new Historico()
          hist.processo = { id: Number(id) }
          hist.descricao = `Processo alterado pelo(a) procurador(a) ${procurador?.nome}`
          hist.usuario = procurador

          await getRepository(Historico)
            .save(hist)
            .catch(async () => {
              await getRepository(Processo).delete(id)
            })
        })

      return res.json({ msg: 'Processo alterado com sucesso!' })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        msg: 'Erro interno do servidor. Tente novamente ou contate o suporte.'
      })
    }
  }

  public async update (req: Request, res: Response) {
    const { id } = req.params
    const {
      status,
      finalizado
    }: { status: string; finalizado: boolean } = req.body

    try {
      const processo = new Processo()

      if (status) {
        processo.status = { id: Number(status) }
        await getRepository(Processo).update(id, processo)

        return res.json({ msg: 'Status alterado com sucesso!' })
      }

      if (finalizado) {
        processo.finalizado = true
        await getRepository(Processo).update(id, processo)

        return res.json({ msg: 'Processo finalizado com sucesso!' })
      }
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        msg: 'Erro interno do servidor. Tente novamente ou contate o suporte.'
      })
    }
  }
}

export default new ProcessoController()
