import { EstadoCredencial } from 'src/core/enum/enums';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';



@Entity('credenciales')
export class Credencial {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    unique: true,
    length: 100,
  })
  username!: string;

  @Column()
  passwordHash!: string;

 @Column({
  type: 'datetime',
  nullable: true,
})
  ultimoLogin?: Date | null;

  @Column({
    type: 'enum',
    enum: EstadoCredencial,
    default: EstadoCredencial.ACTIVA,
  })
  estado!: EstadoCredencial;

  @Column()
  usuarioId!: string;

  @OneToOne(
    () => Usuario,
    (usuario) => usuario.credencial,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'usuarioId',
  })
  usuario!: Usuario;

 @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}