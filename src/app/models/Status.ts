import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { Processo } from './Processo'

@Entity({
  name: 'processos_status'
})
export class Status {
  @PrimaryGeneratedColumn()
  id?: number

  @Column({
    length: 15
  })
  tipo?: string

  @Column({
    length: 20
  })
  status?: string

  @OneToMany(() => Processo, processo => processo.status)
  processo?: Processo[]
}
