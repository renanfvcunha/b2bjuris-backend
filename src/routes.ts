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

routes.get('/', (req, res) => res.json({ msg: 'B2B Juris API' }))

routes.post('/session', SessionController.store)
routes.post(
  '/storefirstuser',
  UsuarioValidator.storeFirstUser,
  UsuarioController.storeFirstUser
)

/** Rotas acessíveis para usuários autenticados */
routes.use(authMiddleware)

routes.get('/assuntos', AssuntoController.index)

routes.get('/processos', ProcessoController.index)
routes.post(
  '/processos',
  uploadDocs,
  ProcessoValidator.store,
  ProcessoController.store
)

/** Rotas acessíveis para administradores */
routes.use(isAdminMiddleware)

routes.get('/usuarios', UsuarioController.index)
routes.post('/usuarios', UsuarioValidator.store, UsuarioController.store)
routes.delete('/usuarios/:id', UsuarioController.destroy)

routes.post('/assuntos', AssuntoController.store)

export default routes
