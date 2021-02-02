import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

import { Administrativo } from './Administrativo'
import { Arquivo } from './Arquivo'
import { Assunto } from './Assunto'
import { Encaminhamento } from './Encaminhamento'
import { Historico } from './Historico'
import { Judicial } from './Judicial'
import { Observacoes } from './Observacoes'
import { Oficio } from './Oficio'
import { Status } from './Status'

@Entity({
  name: 'processos'
})
export class Processo {
  @PrimaryGeneratedColumn()
  id?: number

  @ManyToOne(() => Assunto, assunto => assunto.processo, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    nullable: true
  })
  @JoinColumn({
    name: 'id_assunto'
  })
  assunto?: Assunto

  @ManyToOne(() => Status, status => status.processo, {
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

  @Column({
    default: false
  })
  finalizado?: boolean

  @OneToOne(() => Administrativo, administrativo => administrativo.processo)
  administrativo?: Administrativo

  @OneToOne(() => Judicial, judicial => judicial.processo)
  judicial?: Judicial

  @OneToOne(() => Oficio, oficio => oficio.processo)
  oficio?: Oficio

  @OneToMany(() => Arquivo, arquivo => arquivo.processo, {
    cascade: ['insert', 'update']
  })
  arquivo?: Arquivo[]

  @OneToMany(() => Observacoes, observacoes => observacoes.processo, {
    cascade: ['insert']
  })
  observacoes?: Observacoes[]

  @OneToMany(() => Historico, historico => historico.processo, {
    cascade: ['insert']
  })
  historico?: Historico[]

  @OneToMany(() => Oficio, oficio => oficio.processo_ref)
  referencia?: Oficio

  @OneToMany(() => Encaminhamento, encaminhamento => encaminhamento.processo)
  encaminhamento?: Encaminhamento[]

  @CreateDateColumn()
  created_at?: Date

  @UpdateDateColumn()
  updated_at?: Date
}
