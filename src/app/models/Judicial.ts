import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm'

import { Processo } from './Processo'
import { TipoAcao } from './TiposAcao'

@Entity({
  name: 'judiciais'
})
export class Judicial {
  @OneToOne(() => Processo, { primary: true })
  @JoinColumn({
    name: 'id_processo'
  })
  processo?: Processo

  @Column({
    length: 150
  })
  polo_passivo?: string

  @Column('double')
  valor_causa?: number

  @ManyToOne(type => TipoAcao, tipo_acao => tipo_acao.judicial, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    nullable: true
  })
  @JoinColumn({
    name: 'id_tipo_acao'
  })
  tipo_acao?: TipoAcao
}