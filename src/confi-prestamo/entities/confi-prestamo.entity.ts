import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('configuracion_prestamos')
export class ConfiPrestamo {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  adminId!: string;

  @Column({
    default: 20,
  })
  interesDefault!: number;

  @Column({
    default: 10,
  })
  seguroDefault!: number;

  @Column({
    length: 20,
    default: 'ACTIVO',
  })
  estado!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}