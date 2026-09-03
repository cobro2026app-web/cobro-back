import { Caja } from "src/caja/entities/caja.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('rutas')
export class Ruta {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    length: 100,
  })
  nombre!: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  descripcion!: string | null;

  @Column({
    default: true,
  })
  habilitada!: boolean;

  // Admin propietario
  @Column({
    type: 'varchar',
    length: 36,
  })
  adminId!: string;

  // Cobrador actualmente asignado
  @Column({
    type: 'int',
  })
  capital!: number | null;

  @Column({
    type: 'varchar',
    length: 36,
    nullable: true,
  })
  cobradorId!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Caja, caja => caja.ruta)
cajas?: Caja[];
}