import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { Encaminhamento } from './Encaminhamento'

@Entity({
  name: 'tipos_encaminhamento'
})
export class TipoEncaminhamento {
  @PrimaryGeneratedColumn()
  id?: number

  @Column({
    length: 50
  })
  tipo_encaminhamento?: string

  @OneToMany(
    () => Encaminhamento,
    encaminhamento => encaminhamento.tipo_encaminhamento
  )
  encaminhamento?: Encaminhamento[]
}
