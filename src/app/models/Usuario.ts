import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

import { Encaminhamento } from './Encaminhamento'
import { Historico } from './Historico'

@Entity({
  name: 'usuarios'
})
export class Usuario {
  @PrimaryGeneratedColumn()
  id?: number

  @Column({
    length: 100
  })
  nome?: string

  @Column({
    length: 50
  })
  nome_usuario?: string

  @Column({
    length: 50
  })
  email?: string

  @Column({
    length: 50
  })
  tipo_usuario?: string

  @Column({
    length: 150
  })
  senha?: string

  @OneToMany(() => Historico, historico => historico.usuario)
  historico?: Historico[]

  @OneToMany(() => Encaminhamento, encaminhamento => encaminhamento.usuario)
  encaminhamento?: Encaminhamento[]

  @CreateDateColumn()
  created_at?: Date

  @UpdateDateColumn()
  updated_at?: Date
}
