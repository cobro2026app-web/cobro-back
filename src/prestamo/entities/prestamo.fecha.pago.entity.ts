import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { Prestamo } from './prestamo.entity';
import { Pago } from 'src/pagos/entities/pago.entity';

@Entity('prestamo_fechas_pago')
export class PrestamoFechaPago {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({
        name: 'prestamo_id',
        type: 'char',
        length: 36,
    })
    prestamoId!: string;

    @ManyToOne(
        () => Prestamo,
        (prestamo) => prestamo.fechasPago,
        {
            nullable: false,
            onDelete: 'CASCADE',
        },
    )
    @JoinColumn({
        name: 'prestamo_id',
    })
    prestamo!: Prestamo;

    /**
     * Número consecutivo del pago programado.
     *
     * 1, 2, 3, 4...
     */
    @Column({
        type: 'int',
    })
    numero!: number;

    /**
     * Fecha en la que corresponde realizar el cobro.
     */
    @Column({
        name: 'fecha_pago',
        type: 'date',
    })
    fechaPago!: Date;

    /**
     * Valor que corresponde cobrar en esta fecha.
     *
     * Se guarda aquí para conservar el histórico
     * aunque posteriormente cambie alguna configuración.
     */
    @Column({
        type: 'int',
    })
    valor!: number;

    @CreateDateColumn({
        name: 'created_at',
    })
    createdAt!: Date;

    /**
     * Pagos realizados sobre esta fecha de cobro.
     *
     * Permite pagos parciales.
     */
    @OneToMany(
        () => Pago,
        (pago) => pago.fechaPagoProgramada,
    )
    pagos!: Pago[];
}