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

describe('Authentication', () => {
  it('Should authenticate with valid credentials', async () => {
    await request(app).post('/storefirstuser').send({
      nome: 'José Carlos',
      nome_usuario: 'zeca',
      senha: 'teste123',
      conf_senha: 'teste123'
    })

    const response = await request(app).post('/session').send({
      nome_usuario: 'zeca',
      senha: 'teste123'
    })

    expect(response.body).toHaveProperty('token')
  })

  it('Should be able to access private routes when autenticated', async () => {
    await request(app).post('/storefirstuser').send({
      nome: 'José Carlos',
      nome_usuario: 'zeca',
      senha: 'teste123',
      conf_senha: 'teste123'
    })

    const user = await request(app).post('/session').send({
      nome_usuario: 'zeca',
      senha: 'teste123'
    })

    const response = await request(app)
      .get('/private')
      .set('Authorization', `Bearer ${user.body.token}`)

    expect(response.status).toBe(200)
  })

  it('Should not be able to access private routes when not autenticated', async () => {
    await request(app).post('/storefirstuser').send({
      nome: 'José Carlos',
      nome_usuario: 'zeca',
      senha: 'teste123',
      conf_senha: 'teste123'
    })

    await request(app).post('/session').send({
      nome_usuario: 'zeca',
      senha: 'teste123'
    })

    const response = await request(app).get('/private')

    expect(response.status).toBe(401)
  })

  it('Should not be able to access private routes with invalid token', async () => {
    await request(app).post('/storefirstuser').send({
      nome: 'José Carlos',
      nome_usuario: 'zeca',
      senha: 'teste123',
      conf_senha: 'teste123'
    })

    await request(app).post('/session').send({
      nome_usuario: 'zeca',
      senha: 'teste123'
    })

    const response = await request(app)
      .get('/private')
      .set('Authorization', `Bearer askdjsokjasokdjasokdj`)

    expect(response.status).toBe(401)
  })

  it('Should not be able to access admin routes', async () => {
    const admin = await request(app).post('/storefirstuser').send({
      nome: 'José Carlos',
      nome_usuario: 'zeca',
      senha: 'teste123',
      conf_senha: 'teste123'
    })

    await request(app)
      .post('/users')
      .send({
        nome: 'José Francisco',
        nome_usuario: 'chico',
        tipo_usuario: 'usuario',
        senha: 'teste123',
        conf_senha: 'teste123'
      })
      .set('Authorization', `Bearer ${admin.body.token}`)

    const user = await request(app).post('/session').send({
      nome_usuario: 'chico',
      senha: 'teste123'
    })

    const response = await request(app)
      .get('/adminprivate')
      .set('Authorization', `Bearer ${user.body.token}`)

    expect(response.status).toBe(401)
  })
})
