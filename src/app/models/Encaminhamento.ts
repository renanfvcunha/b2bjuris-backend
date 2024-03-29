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
import { TipoEncaminhamento } from './TipoEncaminhamento'
import { Usuario } from './Usuario'

@Entity({
  name: 'encaminhamentos'
})
export class Encaminhamento {
  @PrimaryGeneratedColumn()
  id?: number

  @ManyToOne(() => Processo, processo => processo.encaminhamento, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: false
  })
  @JoinColumn({
    name: 'id_processo'
  })
  processo?: Processo

  @ManyToOne(() => Usuario, usuario => usuario.encaminhamento, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  })
  @JoinColumn({
    name: 'id_usuario'
  })
  usuario?: Usuario

  @ManyToOne(
    () => TipoEncaminhamento,
    tipo_encaminhamento => tipo_encaminhamento.encaminhamento,
    {
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    }
  )
  @JoinColumn({
    name: 'id_tipo_encaminhamento'
  })
  tipo_encaminhamento?: TipoEncaminhamento

  @Column({
    default: false
  })
  recebido?: boolean

  @Column('date')
  prazo?: Date

  @Column('text', { nullable: true })
  observacoes?: string

  @CreateDateColumn()
  created_at?: Date

  @UpdateDateColumn()
  updated_at?: Date
}
