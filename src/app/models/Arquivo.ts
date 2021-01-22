import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'

import { Processo } from './Processo'

@Entity({
  name: 'processos_arquivos'
})
export class Arquivo {
  @PrimaryGeneratedColumn()
  id?: number

  @ManyToOne(type => Processo, processo => processo.arquivo, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  })
  @JoinColumn({
    name: 'id_processo'
  })
  processo?: Processo

  @Column({
    length: 150
  })
  nome?: string

  url?: string
}
