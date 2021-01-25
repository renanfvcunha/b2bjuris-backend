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
  name: 'historico_processos'
})
export class Historico {
  @PrimaryGeneratedColumn()
  id?: number

  @ManyToOne(() => Processo, processo => processo.historico, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: false
  })
  @JoinColumn({
    name: 'id_processo'
  })
  processo?: Processo

  @ManyToOne(() => Usuario, usuario => usuario.historico, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  })
  @JoinColumn({
    name: 'id_usuario'
  })
  usuario?: Usuario

  @Column({
    length: 300
  })
  descricao?: string

  @CreateDateColumn()
  created_at?: Date

  @UpdateDateColumn()
  updated_at?: Date
}
