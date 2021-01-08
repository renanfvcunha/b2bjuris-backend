import { getRepository } from 'typeorm'

import { Administrativo } from '../../src/app/models/Administrativo'
import { Processo } from '../../src/app/models/Processo'
import { Oficio } from '../../src/app/models/Oficio'

import dbconfig from '../../dbConfigTest'

beforeAll(async () => {
  await dbconfig.create()
})

afterAll(async () => {
  await dbconfig.close()
})

beforeEach(async () => {
  await dbconfig.clear()
})

describe('Processo Unit', () => {
  it('Should store "processo administrativo" on database', async () => {
    const processo = new Processo()
    processo.numero_processo = 157987
    processo.nome_parte = 'Renan Cunha'
    processo.tipo_processo = 'administrativo'

    const process = await getRepository(Processo).save(processo)

    const administrativo = new Administrativo()
    administrativo.processo = processo
    administrativo.matricula = 458798
    administrativo.cpf = '060.444.943-73'
    administrativo.endereco = 'Rua das Oliveiras'
    administrativo.numero = 4540
    administrativo.complemento = 'Perto da Uno Comunicação'
    administrativo.bairro = 'Jockey'
    administrativo.cidade = 'Timon'
    administrativo.uf = 'PI'
    administrativo.telefone = '8698777987'
    administrativo.observacoes = 'Nada a declarar'

    const admin = await getRepository(Administrativo).save(administrativo)

    console.log(process, admin)

    expect(admin.matricula).toBe(458798)
  })

  it('Should store "oficio" on database', async () => {
    const processo = new Processo()
    processo.numero_processo = 157987
    processo.nome_parte = 'Renan Cunha'
    processo.tipo_processo = 'oficio'

    const process = await getRepository(Processo).save(processo)

    const oficio = new Oficio()
    oficio.processo = processo
    oficio.id_processo_ref = 1

    const ofc = await getRepository(Oficio).save(oficio)

    console.log(process, ofc)

    expect(oficio.id_processo_ref).toBe(1)
  })
})
