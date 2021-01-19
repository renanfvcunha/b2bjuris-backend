import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm'

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

  @Column({
    nullable: true
  })
  id_processo_ref?: number

  @ManyToOne(type => Secretaria, secretaria => secretaria.oficio, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    nullable: true
  })
  @JoinColumn({
    name: 'id_secretaria'
  })
  secretaria?: Secretaria
}
