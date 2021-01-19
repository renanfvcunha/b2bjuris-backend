import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Arquivo } from './Arquivo'

import { Assunto } from './Assunto'
import { Historico } from './Historico'
import { Status } from './Status'

@Entity({
  name: 'processos'
})
export class Processo {
  @PrimaryGeneratedColumn()
  id?: number

  @ManyToOne(type => Assunto, assunto => assunto.processo, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    nullable: true
  })
  @JoinColumn({
    name: 'id_assunto'
  })
  assunto?: Assunto

  @ManyToOne(type => Status, status => status.processo, {
    cascade: ['insert'],
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    nullable: true
  })
  @JoinColumn({
    name: 'id_status'
  })
  status?: Status

  @Column({ unique: true })
  numero_processo?: number

  @Column({
    length: 191,
    nullable: true
  })
  nome_parte?: string

  @Column({
    length: 20
  })
  tipo_processo?: string

  @OneToMany(type => Arquivo, arquivo => arquivo.processo, {
    cascade: ['insert']
  })
  arquivo?: Arquivo[]

  @OneToMany(type => Historico, historico => historico.processo, {
    cascade: ['insert']
  })
  historico?: Historico[]

  @CreateDateColumn()
  created_at?: Date

  @UpdateDateColumn()
  updated_at?: Date
}
