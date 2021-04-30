import { getRepository, MigrationInterface, QueryRunner } from 'typeorm'
import { Secretaria } from '../../app/models/Secretaria'
import { SecretariaSeed } from '../seeds/SecretariaSeed'

export class CreateSeedSecretaria1619717667054 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    try {
      await getRepository(Secretaria).save(SecretariaSeed)
    } catch (err) {
      console.error(err)
    }
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    try {
      await getRepository(Secretaria).delete({})
    } catch (err) {
      console.error(err)
    }
  }
}
