import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'

import { Processo } from './Processo'

@Entity({
  name: 'administrativos'
})
export class Administrativo {
  @OneToOne(() => Processo, { primary: true })
  @JoinColumn({
    name: 'id_processo'
  })
  processo?: Processo

  @Column()
  matricula?: number

  @Column({
    length: 15
  })
  cpf?: string

  @Column({
    length: 150
  })
  endereco?: string

  @Column()
  numero?: number

  @Column({
    length: 100
  })
  complemento?: string

  @Column({
    length: 50
  })
  bairro?: string

  @Column({
    length: 50
  })
  cidade?: string

  @Column({
    length: 2
  })
  uf?: string

  @Column({
    length: 20
  })
  telefone?: string

  @Column('text')
  observacoes?: string
}
