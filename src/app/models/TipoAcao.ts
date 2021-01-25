import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Judicial } from './Judicial'

@Entity({
  name: 'tipos_acao'
})
export class TipoAcao {
  @PrimaryGeneratedColumn()
  id?: number

  @Column({
    length: 50
  })
  tipo_acao?: string

  @OneToMany(() => Judicial, judicial => judicial.tipo_acao)
  judicial?: Judicial[]
}
