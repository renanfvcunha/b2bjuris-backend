import { Router } from 'express'

const routes = Router()

routes.get('/', (req, res) => res.json({ msg: 'SysProcuradoria API' }))

export default routes
