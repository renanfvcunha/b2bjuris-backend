import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity({
  name: 'users'
})
export class Usuario {
  @PrimaryGeneratedColumn()
  id?: number

  @Column({
    length: 100
  })
  nome?: string

  @Column({
    length: 50
  })
  nome_usuario?: string

  @Column({
    length: 50
  })
  email?: string

  @Column({
    length: 50
  })
  tipo_usuario?: string

  @Column({
    length: 150
  })
  senha?: string

  @CreateDateColumn()
  created_at?: Date

  @UpdateDateColumn()
  updated_at?: Date
}
