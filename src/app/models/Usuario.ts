import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Arquivo } from './Arquivo'

import { Encaminhamento } from './Encaminhamento'
import { Historico } from './Historico'
import { Observacoes } from './Observacoes'

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

  @OneToMany(() => Arquivo, arquivo => arquivo.usuario)
  arquivo?: Arquivo[]

  @OneToMany(() => Observacoes, observacoes => observacoes.usuario)
  observacoes?: Observacoes[]

  @CreateDateColumn()
  created_at?: Date

  @UpdateDateColumn()
  updated_at?: Date
}
