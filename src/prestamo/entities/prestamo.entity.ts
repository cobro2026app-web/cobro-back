import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Usuario } from 'src/usuario/entities/usuario.entity';
import { PrestamoFechaPago } from './prestamo.fecha.pago.entity';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { Pago } from 'src/pago/entities/pago.entity';

export enum FrecuenciaPrestamo {
  DIARIO = 'DIARIO',
  SEMANAL = 'SEMANAL',
  QUINCENAL = 'QUINCENAL',
  MENSUAL = 'MENSUAL',
}

export enum EstadoPrestamo {
  ACTIVO = 'ACTIVO',
  PAGADO = 'PAGADO',
  CANCELADO = 'CANCELADO',
}

@Entity('prestamos')
export class Prestamo {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * Cliente al que pertenece el préstamo.
   */
  @Column({
    name: 'cliente_id',
    type: 'char',
    length: 36,
  })
  clienteId!: string;

  @ManyToOne(
    () => Cliente,
    {
      nullable: false,
    },
  )
  @JoinColumn({
    name: 'cliente_id',
  })
  cliente!: Cliente;

  /**
   * Usuario que creó el préstamo.
   * Normalmente cobrador/admin.
   */
  @Column({
    name: 'creado_por_id',
    type: 'char',
    length: 36,
  })
  creadoPorId!: string;

  @ManyToOne(
    () => Usuario,
    {
      nullable: false,
    },
  )
  @JoinColumn({
    name: 'creado_por_id',
  })
  creadoPor!: Usuario;

  /**
   * Capital prestado.
   */
  @Column({
    type: 'int',
  })
  monto!: number;
  
  @Column({
    type: 'int',
  })
  deudaActual!: number;

  @Column({
    type: 'int',
  })
  valorCuota!: number;

  /**
   * Interés total generado por el préstamo.
   */
  @Column({
    type: 'int',
  })
  interes!: number;

  @Column({
    type: 'int',
  })
  montoInteres!: number;

  /**
   * Monto + interés.
   */
  @Column({
    name: 'total_pagar',
    type: 'int',
  })
  totalPagar!: number;

  /**
   * Cantidad de pagos programados.
   */
  @Column({
    name: 'numero_cuotas',
    type: 'int',
  })
  numeroCuotas!: number;

  /**
   * Frecuencia con la que se debe cobrar.
   */
  @Column({
    type: 'enum',
    enum: FrecuenciaPrestamo,
  })
  frecuencia!: FrecuenciaPrestamo;

  /**
   * Fecha en que se entrega/inicia el préstamo.
   */
  @Column({
    name: 'fecha_inicio',
    type: 'date',
  })
  fechaInicio!: Date;

  /**
   * Fecha del último pago programado.
   */
  @Column({
    name: 'fecha_fin',
    type: 'date',
  })
  fechaFin!: Date;

  @Column({
    type: 'enum',
    enum: EstadoPrestamo,
    default: EstadoPrestamo.ACTIVO,
  })
  estado!: EstadoPrestamo;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt!: Date;

  /**
   * Calendario de pagos.
   */
  @OneToMany(
    () => PrestamoFechaPago,
    (fechaPago) => fechaPago.prestamo,
  )
  fechasPago!: PrestamoFechaPago[];

  @OneToMany(
  () => Pago,
  (pago) => pago.prestamo,
)
pagos!: Pago[];
}