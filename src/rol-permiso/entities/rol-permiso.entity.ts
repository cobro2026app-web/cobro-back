import { Permiso } from 'src/permiso/entities/permiso.entity';
import { Rol } from 'src/rol/entities/rol.entity';
import {
    Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';


@Entity('rol_permisos')
@Unique([
  'rolId',
  'permisoId',
])
export class RolPermiso {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  rolId!: string;

  @Column()
  permisoId!: string;

  @ManyToOne(
    () => Rol,
    (rol) => rol.permisos,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'rolId',
  })
  rol!: Rol;

  @ManyToOne(
    () => Permiso,
    (permiso) => permiso.roles,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'permisoId',
  })
  permiso!: Permiso;
}