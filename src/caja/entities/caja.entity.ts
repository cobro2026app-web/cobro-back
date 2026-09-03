import { Ruta } from 'src/ruta/entities/ruta.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { CajaMovimiento } from './caja-movimiento.entity';


export enum EstadoCaja {
    ABIERTA = 'ABIERTA',
    CERRADA = 'CERRADA',
}

@Index(['rutaId', 'fechaOperacion'], { unique: true })

@Entity('cajas')
export class Caja {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    /**
     * Ruta a la que pertenece la caja.
     */
    @Column({ type: 'char', length: 36 })
    rutaId!: string;

    @ManyToOne(() => Ruta, ruta => ruta.cajas, {
        nullable: false,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({ name: 'rutaId' })
    ruta!: Ruta;

    /**
     * Usuario que abrió la caja.
     */
    @Column({ type: 'char', length: 36 })
    abiertaPorId!: string;

    /**
     * Monto con el que se inicia la jornada.
     */
    @Column({
        type: 'int',
    })
    montoInicial!: number;

    /**
     * Saldo esperado según los movimientos.
     */
    @Column({
        type: 'int',
        default: 0,
    })
    montoEsperado!: number;

    /**
     * Dinero contado físicamente al cerrar.
     */
    @Column({
        type: 'int',
        nullable: true,
    })
    montoReal!: number | null;

    /**
     * montoReal - montoEsperado
     */
    @Column({
        type: 'int',
        nullable: true,
    })
    diferencia!: number | null;

    @Column({
        type: 'enum',
        enum: EstadoCaja,
        default: EstadoCaja.ABIERTA,
    })
    estado!: EstadoCaja;

    @Column({ type: 'datetime' })
    fechaApertura!: Date;

    @Column({ type: 'datetime', nullable: true })
    fechaCierre!: Date | null;

    @OneToMany(
        () => CajaMovimiento,
        movimiento => movimiento.caja,
    )
    movimientos!: CajaMovimiento[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @Column({
        type: 'date',
    })
    fechaOperacion!: string;
}