import 'reflect-metadata'
import express from 'express'

class App {
  public express = express.application

  public constructor () {
    this.express = express()
    this.routes()
  }

  private routes () {
    this.express.get('/', (req, res) => {
      return res.json({ msg: 'Hello!!' })
    })
  }
}

export default new App().express
