import { Router } from 'express'
import uploadDocs from './config/uploadDocs'

import UsuarioValidator from './app/validators/UsuarioValidator'

import authMiddleware from './app/middlewares/auth'
import isAdminMiddleware from './app/middlewares/isAdmin'

import UsuarioController from './app/controllers/UsuarioController'
import SessionController from './app/controllers/SessionController'
import ProcessoController from './app/controllers/ProcessoController'
import AssuntoController from './app/controllers/AssuntoController'
import ProcessoValidator from './app/validators/ProcessoValidator'

const routes = Router()

routes.get('/', (req, res) => res.json({ msg: 'SysProcuradoria API' }))

routes.post('/session', SessionController.store)
routes.post(
  '/storefirstuser',
  UsuarioValidator.storeFirstUser,
  UsuarioController.storeFirstUser
)

routes.use(authMiddleware)

routes.post(
  '/processos',
  uploadDocs,
  ProcessoValidator.store,
  ProcessoController.store
)

routes.use(isAdminMiddleware)

routes.get('/usuarios', UsuarioController.index)
routes.post('/usuarios', UsuarioValidator.store, UsuarioController.store)

routes.post('/assunto', AssuntoController.store)

export default routes
