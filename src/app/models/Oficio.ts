import { Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm'

import { Processo } from './Processo'
import { Secretaria } from './Secretaria'

@Entity({
  name: 'oficios'
})
export class Oficio {
  @OneToOne(() => Processo, processo => processo.oficio, {
    primary: true,
    cascade: ['insert'],
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  })
  @JoinColumn({
    name: 'id_processo'
  })
  processo?: Processo

  @ManyToOne(() => Processo, processo => processo.referencia, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    nullable: true
  })
  @JoinColumn({
    name: 'id_processo_ref'
  })
  processo_ref?: Processo

  @ManyToOne(() => Secretaria, secretaria => secretaria.oficio, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    nullable: true
  })
  @JoinColumn({
    name: 'id_secretaria'
  })
  secretaria?: Secretaria
}
