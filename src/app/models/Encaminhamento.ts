import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

import { Processo } from './Processo'
import { Usuario } from './Usuario'

@Entity({
  name: 'encaminhamentos'
})
export class Encaminhamento {
  @PrimaryGeneratedColumn()
  id?: number

  @ManyToOne(type => Processo, processo => processo.encaminhamento, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: false
  })
  @JoinColumn({
    name: 'id_processo'
  })
  processo?: Processo

  @ManyToOne(type => Usuario, usuario => usuario.encaminhamento, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  })
  @JoinColumn({
    name: 'id_usuario'
  })
  usuario?: Usuario

  @Column({
    default: false
  })
  recebido?: boolean

  @Column({
    length: 50
  })
  tipo_encaminhamento?: string

  @Column('date')
  prazo?: Date

  @Column('text', { nullable: true })
  observacoes?: string

  @CreateDateColumn()
  created_at?: Date

  @UpdateDateColumn()
  updated_at?: Date
}
