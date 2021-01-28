import { Request, Response } from 'express'
import { getRepository } from 'typeorm'

import IEncaminhamento from '../interfaces/IEncaminhamento'
import { Encaminhamento } from '../models/Encaminhamento'
import { Historico } from '../models/Historico'
import { Usuario } from '../models/Usuario'

interface UserRequest extends Request {
  userId?: number
}

class EncaminhamentoController {
  public async index (req: UserRequest, res: Response) {
    const userId = req.userId

    try {
      const encaminhamentosQuery = await getRepository(Encaminhamento)
        .createQueryBuilder('encaminhamento')
        .select([
          'encaminhamento.id',
          'encaminhamento.recebido',
          'encaminhamento.prazo',
          'encaminhamento.observacoes',
          'tipo_encaminhamento.tipo_encaminhamento',
          'processo.id',
          'processo.numero_processo',
          'processo.tipo_processo',
          'processo.created_at'
        ])
        .leftJoin('encaminhamento.tipo_encaminhamento', 'tipo_encaminhamento')
        .leftJoin('encaminhamento.processo', 'processo')
        .leftJoin('encaminhamento.usuario', 'usuario')
        .where('usuario.id = :userId', { userId })
        .getMany()

      const encaminhamentos = encaminhamentosQuery.map(enc => ({
        ...enc,
        processo: {
          ...enc.processo,
          tipo_processo:
            enc.processo?.tipo_processo?.charAt(0).toUpperCase() +
            (enc.processo?.tipo_processo?.slice(1) || '')
        }
      }))

      return res.json(encaminhamentos)
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        msg: 'Erro interno do servidor. Tente novamente ou contate o suporte.'
      })
    }
  }

  public async store (req: UserRequest, res: Response) {
    const { id } = req.params
    const {
      id_usuario,
      id_tipo_encaminhamento,
      prazo,
      observacoes
    }: IEncaminhamento = req.body
    const userId = req.userId

    try {
      const enc = new Encaminhamento()
      enc.processo = { id: Number(id) }
      enc.usuario = { id: id_usuario }
      enc.tipo_encaminhamento = { id: id_tipo_encaminhamento }
      enc.prazo = new Date(prazo)
      enc.observacoes = observacoes

      await getRepository(Encaminhamento)
        .save(enc)
        .then(async () => {
          const procName = await getRepository(Usuario).findOne({
            select: ['nome'],
            where: {
              id: id_usuario
            }
          })

          const historico = new Historico()
          historico.processo = enc.processo
          historico.usuario = { id: userId }
          historico.descricao = `Processo encaminhado para o(a) procurador(a) ${procName?.nome}`

          await getRepository(Historico)
            .save(historico)
            .catch(async () => {
              await getRepository(Encaminhamento).delete(Number(enc.id))
            })
        })

      return res.json({ msg: 'Processo encaminhado com sucesso!' })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        msg: 'Erro interno do servidor. Tente novamente ou contate o suporte.'
      })
    }
  }
}

export default new EncaminhamentoController()
