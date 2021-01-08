import { createConnection, getConnection } from 'typeorm'

const connection = {
  async create () {
    await createConnection({
      type: 'sqlite',
      database: './__tests__/db.sqlite',
      entities: ['src/app/models/**/*.ts'],
      synchronize: true,
      logging: false
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
