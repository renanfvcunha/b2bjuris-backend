import request from 'supertest'

import app from '../../src/app'
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

describe('User', () => {
  it('Should store new user on database', async () => {
    const response = await request(app).post('/users').send({
      nome: 'José Carlos',
      nome_usuario: 'zeca',
      tipo_usuario: 'admin',
      senha: 'teste123',
      conf_senha: 'teste123'
    })

    expect(response.body.msg).toBe('Usuário Cadastrado Com Sucesso!')
  })
})
