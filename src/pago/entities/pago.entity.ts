import { Prestamo } from 'src/prestamo/entities/prestamo.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum EstadoPago {
  APLICADO = 'APLICADO',
  REVERSADO = 'REVERSADO',
}

@Entity('pagos')
export class Pago {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // =========================
  // PRÉSTAMO
  // =========================

  @Column({
    name: 'prestamo_id',
    type: 'char',
    length: 36,
  })
  prestamoId!: string;

  @ManyToOne(
    () => Prestamo,
    (prestamo) => prestamo.pagos,
    {
      onDelete: 'RESTRICT',
    },
  )
  @JoinColumn({
    name: 'prestamo_id',
  })
  prestamo!: Prestamo;

  // =========================
  // USUARIO QUE REGISTRÓ
  // ADMIN / COBRADOR
  // =========================

  @Column({
    name: 'registrado_por_id',
    type: 'char',
    length: 36,
  })
  registradoPorId!: string;

  @ManyToOne(
    () => Usuario,
    {
      onDelete: 'RESTRICT',
    },
  )
  @JoinColumn({
    name: 'registrado_por_id',
  })
  registradoPor!: Usuario;

  // =========================
  // VALOR
  // =========================

  @Column({
    type: 'int',
  })
  valor!: number;

  // =========================
  // ESTADO
  // =========================

  @Column({
    type: 'enum',
    enum: EstadoPago,
    default: EstadoPago.APLICADO,
  })
  estado!: EstadoPago;

  // =========================
  // REVERSIÓN
  // =========================

  @Column({
    name: 'fecha_reversion',
    type: 'datetime',
    nullable: true,
  })
  fechaReversion!: Date | null;

  @Column({
    name: 'usuario_reversion_id',
    type: 'char',
    length: 36,
    nullable: true,
  })
  usuarioReversionId!: string | null;

  @ManyToOne(
    () => Usuario,
    {
      nullable: true,
      onDelete: 'RESTRICT',
    },
  )
  @JoinColumn({
    name: 'usuario_reversion_id',
  })
  usuarioReversion!: Usuario | null;

  @Column({
    name: 'motivo_reversion',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  motivoReversion!: string | null;

  // =========================
  // AUDITORÍA
  // =========================

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
} 