import { Router } from 'express'

import UsuarioValidator from './app/validators/UsuarioValidator'

import authMiddleware from './app/middlewares/auth'
import isAdminMiddleware from './app/middlewares/isAdmin'

import UsuarioController from './app/controllers/UsuarioController'
import SessionController from './app/controllers/SessionController'

const routes = Router()

routes.get('/', (req, res) => res.json({ msg: 'SysProcuradoria API' }))

routes.post('/session', SessionController.store)
routes.post('/storefirstuser', UsuarioController.storeFirstUser)

routes.use(authMiddleware)
routes.use(isAdminMiddleware)
routes.post('/users', UsuarioValidator.store, UsuarioController.store)

export default routes
