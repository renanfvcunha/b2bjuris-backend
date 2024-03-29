import express, { Router } from 'express'
import { resolve } from 'path'

import uploadDocs from './config/uploadDocs'

import UsuarioValidator from './app/validators/UsuarioValidator'

import authMiddleware from './app/middlewares/auth'
import isAdminMiddleware from './app/middlewares/isAdmin'

import UsuarioController from './app/controllers/UsuarioController'
import SessionController from './app/controllers/SessionController'
import ProcessoController from './app/controllers/ProcessoController'
import AssuntoController from './app/controllers/AssuntoController'
import ProcessoValidator from './app/validators/ProcessoValidator'
import TipoAcaoController from './app/controllers/TipoAcaoController'
import SecretariaController from './app/controllers/SecretariaController'
import StatusController from './app/controllers/StatusController'
import EncaminhamentoController from './app/controllers/EncaminhamentoController'
import TipoEncaminhamentoController from './app/controllers/TipoEncaminhamentoController'

import checkHasUser from './app/utils/checkHasUser'
import checkToken from './app/utils/checkToken'

const routes = Router()

routes.get('/', (req, res) => res.json({ msg: 'B2B Juris API' }))

routes.get('/checkhasuser', checkHasUser)
routes.get('/checktoken', checkToken)

routes.post('/session', SessionController.store)
routes.post(
  '/storefirstuser',
  UsuarioValidator.storeFirstUser,
  UsuarioController.storeFirstUser
)

/** Rotas acessíveis para usuários autenticados */
routes.use(authMiddleware)

routes.use('/docs', express.static(resolve(__dirname, 'uploads', 'docs')))

routes.get('/secretarias', SecretariaController.index)
routes.post('/secretarias', SecretariaController.store)

routes.get('/assuntos', AssuntoController.index)

routes.get('/tiposdeacao', TipoAcaoController.index)
routes.post('/tiposdeacao', TipoAcaoController.store)

routes.get('/status', StatusController.index)
routes.post('/status', StatusController.store)

routes.get('/processos', ProcessoController.index)
routes.get('/processos/:id', ProcessoController.show)
routes.post(
  '/processos',
  uploadDocs,
  ProcessoValidator.store,
  ProcessoController.store
)
routes.patch('/processos/:id', ProcessoController.update)
routes.patch('/updatebyproc/:id', uploadDocs, ProcessoController.updateByProc)
routes.put('/processos/:id', ProcessoController.update)

routes.get('/referencias', ProcessoController.references)

routes.get('/encaminhamentos', EncaminhamentoController.index)
routes.get('/encaminhamentos/:id', EncaminhamentoController.show)
routes.post('/encaminhamentos/:id', EncaminhamentoController.store)
routes.patch('/encaminhamentos/:id', EncaminhamentoController.update)

routes.get('/procuradores', UsuarioController.getProcuradores)

routes.get('/tiposencaminhamento', TipoEncaminhamentoController.index)

/** Rotas acessíveis para troca de senha dos usuário não administradores */
routes.get('/usuarios/me', UsuarioController.me)
routes.put(
  '/usuarios/me/updatepasswd',
  UsuarioValidator.updatePassword,
  UsuarioController.updatePassword
)

/** Rotas acessíveis para administradores */
routes.use(isAdminMiddleware)

routes.get('/usuarios', UsuarioController.index)
routes.get('/usuarios/:id', UsuarioController.show)
routes.post('/usuarios', UsuarioValidator.store, UsuarioController.store)
routes.put('/usuarios/:id', UsuarioValidator.update, UsuarioController.update)

routes.delete('/usuarios/:id', UsuarioController.destroy)

routes.post('/assuntos', AssuntoController.store)

export default routes
