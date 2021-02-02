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
  name: 'processos_observacoes'
})
export class Observacoes {
  @PrimaryGeneratedColumn()
  id?: number

  @ManyToOne(() => Processo, processo => processo.observacoes, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  })
  @JoinColumn({
    name: 'id_processo'
  })
  processo?: Processo

  @ManyToOne(() => Usuario, usuario => usuario.observacoes, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  })
  @JoinColumn({
    name: 'id_usuario'
  })
  usuario?: Usuario

  @Column('text')
  observacoes?: string

  @CreateDateColumn()
  created_at?: Date

  @UpdateDateColumn()
  updated_at?: Date
}
