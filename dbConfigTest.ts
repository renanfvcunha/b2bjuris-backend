import { createConnection, getConnection } from 'typeorm'

import { Usuario } from './src/app/models/Usuario'

const connection = {
  async create () {
    await createConnection({
      type: 'sqlite',
      database: './__tests__/db.sqlite',
      entities: [Usuario],
      synchronize: true,
      logging: 'all'
    })
  },

  async close () {
    await getConnection().close()
  },

  async clear () {
    const connection = getConnection()
    const entities = connection.entityMetadatas

    entities.forEach(async entity => {
      const repository = connection.getRepository(entity.name)
      await repository.query(`DELETE FROM ${entity.tableName}`)
    })
  }
}
export default connection
