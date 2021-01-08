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
  it('Should store first user on database', async () => {
    const response = await request(app).post('/storefirstuser').send({
      nome: 'José Carlos',
      nome_usuario: 'zeca',
      email: 'zeca@gmail.com',
      senha: 'teste123',
      conf_senha: 'teste123'
    })

    expect(response.body).toHaveProperty('token')
  })

  it('Should not store first user on database if a user already exists', async () => {
    await request(app).post('/storefirstuser').send({
      nome: 'José Carlos',
      nome_usuario: 'zeca',
      email: 'zeca@gmail.com',
      senha: 'teste123',
      conf_senha: 'teste123'
    })

    const response = await request(app).post('/storefirstuser').send({
      nome: 'José Carlos',
      nome_usuario: 'zeca',
      email: 'zeca@gmail.com',
      senha: 'teste123',
      conf_senha: 'teste123'
    })

    expect(response.status).toBe(403)
  })

  it('Should store new user on database', async () => {
    const admin = await request(app).post('/storefirstuser').send({
      nome: 'José Carlos',
      nome_usuario: 'zeca',
      email: 'zeca@gmail.com',
      senha: 'teste123',
      conf_senha: 'teste123'
    })

    const response = await request(app)
      .post('/usuarios')
      .send({
        nome: 'José Francisco',
        nome_usuario: 'chico',
        email: 'chico@hotmail.com',
        tipo_usuario: 'usuario',
        senha: 'teste123',
        conf_senha: 'teste123'
      })
      .set('Authorization', `Bearer ${admin.body.token}`)

    expect(response.body.msg).toBe('Usuário Cadastrado Com Sucesso!')
  })

  it('Should not store user on database if username already exists', async () => {
    const admin = await request(app).post('/storefirstuser').send({
      nome: 'José Carlos',
      nome_usuario: 'zeca',
      email: 'zeca@gmail.com',
      senha: 'teste123',
      conf_senha: 'teste123'
    })

    const response = await request(app)
      .post('/usuarios')
      .send({
        nome: 'José Carlos',
        nome_usuario: 'zeca',
        email: 'zeca@gmail.com',
        tipo_usuario: 'admin',
        senha: 'teste123',
        conf_senha: 'teste123'
      })
      .set('Authorization', `Bearer ${admin.body.token}`)

    expect(response.body.msg).toBe(
      'Já existe um usuário com este nome de usuário.'
    )
  })
})
