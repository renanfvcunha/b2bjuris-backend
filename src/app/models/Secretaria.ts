import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { Oficio } from './Oficio'

@Entity({
  name: 'secretarias'
})
export class Secretaria {
  @PrimaryGeneratedColumn()
  id?: number

  @Column({
    length: 150
  })
  secretaria?: string

  @OneToMany(type => Oficio, oficio => oficio.secretaria)
  oficio?: Oficio[]
}
