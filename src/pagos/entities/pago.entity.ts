import { Prestamo } from 'src/prestamo/entities/prestamo.entity';
import { PrestamoFechaPago } from 'src/prestamo/entities/prestamo.fecha.pago.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';


@Entity('pagos')
export class Pago {

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
        {
            nullable: false,
        },
    )
    @JoinColumn({
        name: 'prestamo_id',
    })
    prestamo!: Prestamo;

    @Column({
        name: 'fecha_pago_id',
        type: 'char',
        length: 36,
    })
    fechaPagoId!: string;

    @ManyToOne(
        () => PrestamoFechaPago,
        {
            nullable: false,
        },
    )
    @JoinColumn({
        name: 'fecha_pago_id',
    })
    fechaPagoProgramada!: PrestamoFechaPago;

    @Column({
        name: 'registrado_por_id',
        type: 'char',
        length: 36,
    })
    registradoPorId!: string;

    @ManyToOne(
        () => Usuario,
        {
            nullable: false,
        },
    )
    @JoinColumn({
        name: 'registrado_por_id',
    })
    registradoPor!: Usuario;

    @Column({
        type: 'int',
    })
    valor!: number;

    @Column({
        name: 'fecha_pago',
        type: 'date',
    })
    fechaPago!: Date;

    @CreateDateColumn({
        name: 'created_at',
    })
    createdAt!: Date;
}