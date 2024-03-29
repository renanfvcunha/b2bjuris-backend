import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { Processo } from './Processo'

@Entity({
  name: 'assuntos_processos'
})
export class Assunto {
  @PrimaryGeneratedColumn()
  id?: number

  @Column({
    length: 15
  })
  tipo?: string

  @Column({
    length: 150
  })
  assunto?: string

  @OneToMany(() => Processo, processo => processo.assunto)
  processo?: Processo[]
}
