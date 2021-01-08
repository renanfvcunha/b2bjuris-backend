import { Router } from 'express'

import UsuarioValidator from './app/validators/UsuarioValidator'

import authMiddleware from './app/middlewares/auth'
import isAdminMiddleware from './app/middlewares/isAdmin'

import UsuarioController from './app/controllers/UsuarioController'
import SessionController from './app/controllers/SessionController'
import ProcessoController from './app/controllers/ProcessoController'

const routes = Router()

routes.get('/', (req, res) => res.json({ msg: 'SysProcuradoria API' }))

routes.post('/session', SessionController.store)
routes.post(
  '/storefirstuser',
  UsuarioValidator.storeFirstUser,
  UsuarioController.storeFirstUser
)

routes.get('/private', authMiddleware, (req, res) =>
  res.json({ msg: 'Rota Privada' })
)

routes.get('/adminprivate', authMiddleware, isAdminMiddleware, (req, res) =>
  res.json({ msg: 'Rota Privada para o Admin' })
)

routes.use(authMiddleware)

routes.post('/processos', ProcessoController.store)

routes.use(isAdminMiddleware)

routes.post('/usuarios', UsuarioValidator.store, UsuarioController.store)

export default routes
