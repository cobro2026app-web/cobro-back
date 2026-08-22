import { RolPermiso } from 'src/rol-permiso/entities/rol-permiso.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';


@Entity('permisos')
export class Permiso {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    unique: true,
    length: 100,
  })
  codigo!: string;

  @Column({
    length: 150,
  })
  nombre!: string;

  @Column({
    nullable: true,
  })
  descripcion?: string;

  @Column({
    length: 100,
  })
  modulo!: string;

  @Column({
    default: true,
  })
  estado!: boolean;

  @OneToMany(
    () => RolPermiso,
    (rolPermiso) => rolPermiso.permiso,
  )
  roles!: RolPermiso[];
}