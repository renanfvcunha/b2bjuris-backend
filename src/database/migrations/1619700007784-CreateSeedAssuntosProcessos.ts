import { getRepository, MigrationInterface, QueryRunner } from 'typeorm'
import { Assunto } from '../../app/models/Assunto'
import { AssuntoSeed } from '../seeds/AssuntoSeed'

export class CreateSeedAssuntosProcessos1619700007784
  implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    try {
      await getRepository(Assunto).save(AssuntoSeed)
    } catch (err) {
      console.error(err)
    }
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    try {
      await getRepository(Assunto).delete({})
    } catch (err) {
      console.error(err)
    }
  }
}
