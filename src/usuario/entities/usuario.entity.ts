import { Credencial } from 'src/credencial/entities/credencial.entity';
import { Rol } from 'src/rol/entities/rol.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';


export enum EstadoUsuario {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
}

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    length: 100,
  })
  nombre!: string;

  @Column({
    length: 100,
  })
  apellido!: string;

  @Column({
    unique: true,
    length: 30,
  })
  documento!: string;

  @Column({
    nullable: true,
    length: 30,
  })
  telefono?: string;

  @Column({
    nullable: true,
    unique: true,
    length: 150,
  })
  email?: string;

  @Column()
  rolId!: string;

  @ManyToOne(
    () => Rol,
    (rol) => rol.usuarios,
  )
  @JoinColumn({
    name: 'rolId',
  })
  rol!: Rol;

  @Column({
    type: 'enum',
    enum: EstadoUsuario,
    default: EstadoUsuario.ACTIVO,
  })
  estado!: EstadoUsuario;

  @Column({
    nullable: true,
  })
  createdById?: string;

  @ManyToOne(
    () => Usuario,
    (usuario) => usuario.usuariosCreados,
    {
      nullable: true,
    },
  )
  @JoinColumn({
    name: 'createdById',
  })
  createdBy?: Usuario;

  @OneToOne(
    () => Credencial,
    (credencial) => credencial.usuario,
  )
  credencial!: Credencial;

  @OneToMany(
    () => Usuario,
    (usuario) => usuario.createdBy,
  )
  usuariosCreados!: Usuario[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}