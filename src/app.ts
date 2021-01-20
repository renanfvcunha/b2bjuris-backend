import 'reflect-metadata'
import express from 'express'
import { createConnection } from 'typeorm'
import cors from 'cors'
import { resolve } from 'path'

import routes from './routes'

class App {
  public express = express.application

  public constructor () {
    this.express = express()
    this.middlewares()
    this.routes()
    if (process.env.NODE_ENV !== 'test') {
      this.database()
    }
  }

  private middlewares () {
    this.express.use(express.json())
    this.express.use(cors())
    this.express.use(
      '/docs',
      express.static(resolve(__dirname, 'uploads', 'docs'))
    )
  }

  private routes () {
    this.express.use(routes)
  }

  private async database () {
    await createConnection().then(() => console.log('DB Connected!'))
  }
}

export default new App().express
