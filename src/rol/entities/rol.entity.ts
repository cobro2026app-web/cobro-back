import { RolPermiso } from 'src/rol-permiso/entities/rol-permiso.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';


@Entity('roles')
export class Rol {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    unique: true,
    length: 50,
  })
  codigo!: string;
  
  @Column({
    unique: true,
    length: 50,
  })
  nombre!: string;

  @Column({
    nullable: true,
    length: 255,
  })
  descripcion?: string;

  @Column({
    default: true,
  })
  estado!: boolean;

  @OneToMany(
    () => Usuario,
    (usuario) => usuario.rol,
  )
  usuarios!: Usuario[];

  @OneToMany(
    () => RolPermiso,
    (rolPermiso) => rolPermiso.rol,
  )
  permisos!: RolPermiso[];
}