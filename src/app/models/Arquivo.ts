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
    onDelete: 'SET NULL',
    nullable: true
  })
  @JoinColumn({
    name: 'id_assunto'
  })
  processo?: Processo

  @Column({
    length: 150
  })
  assunto?: string
}
