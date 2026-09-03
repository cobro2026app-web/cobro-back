import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Caja } from './caja.entity';

export enum TipoMovimientoCaja {
  PRESTAMO = 'PRESTAMO',
  PAGO = 'PAGO',
  GASTO = 'GASTO',
  INGRESO = 'INGRESO',
  AJUSTE = 'AJUSTE',
}

export enum NaturalezaMovimientoCaja {
  ENTRADA = 'ENTRADA',
  SALIDA = 'SALIDA',
}

@Entity('caja_movimientos')
export class CajaMovimiento {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'char', length: 36 })
  cajaId!: string;

  @ManyToOne(
    () => Caja,
    caja => caja.movimientos,
    {
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'cajaId' })
  caja!: Caja;

  @Column({
    type: 'enum',
    enum: TipoMovimientoCaja,
  })
  tipo!: TipoMovimientoCaja;

  @Column({
    type: 'enum',
    enum: NaturalezaMovimientoCaja,
  })
  naturaleza!: NaturalezaMovimientoCaja;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  valor!: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  descripcion!: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}