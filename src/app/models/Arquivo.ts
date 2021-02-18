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
  name: 'processos_arquivos'
})
export class Arquivo {
  @PrimaryGeneratedColumn()
  id?: number

  @ManyToOne(() => Processo, processo => processo.arquivo, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  })
  @JoinColumn({
    name: 'id_processo'
  })
  processo?: Processo

  @ManyToOne(() => Usuario, usuario => usuario.arquivo, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  })
  @JoinColumn({
    name: 'id_usuario'
  })
  usuario?: Usuario

  @Column({
    length: 150
  })
  nome?: string

  @CreateDateColumn()
  created_at?: Date

  @UpdateDateColumn()
  updated_at?: Date
}
