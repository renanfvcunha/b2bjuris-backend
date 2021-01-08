import { Request, Response } from 'express'
import { getRepository } from 'typeorm'

import IAdministrativo from '../interfaces/IAdministrativo'
import IJudicial from '../interfaces/IJudicial'
import IOficio from '../interfaces/IOficio'
import IProcesso from '../interfaces/IProcesso'
import { Administrativo } from '../models/Administrativo'
import { Judicial } from '../models/Judicial'
import { Oficio } from '../models/Oficio'
import { Processo } from '../models/Processo'

class ProcessoController {
  public async store (req: Request, res: Response) {
    const {
      numero_processo,
      nome_parte,
      tipo_processo,
      assunto
    }: IProcesso = req.body

    const processo = new Processo()
    processo.numero_processo = numero_processo
    processo.nome_parte = nome_parte
    processo.tipo_processo = tipo_processo
    processo.assunto = { id: assunto }

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
  }
}

export default new ProcessoController()
