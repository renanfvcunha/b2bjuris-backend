import { getRepository, MigrationInterface, QueryRunner } from 'typeorm'
import { TipoAcao } from '../../app/models/TipoAcao'
import { TipoAcaoSeed } from '../seeds/TipoAcaoSeed'

export class CreateSeedTipoAcao1619704519786 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    try {
      await getRepository(TipoAcao).save(TipoAcaoSeed)
    } catch (err) {
      console.error(err)
    }
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    try {
      await getRepository(TipoAcao).delete({})
    } catch (err) {
      console.error(err)
    }
  }
}
