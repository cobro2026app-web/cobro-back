import { Prestamo } from 'src/prestamo/entities/prestamo.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('clientes')
export class Cliente {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({
        length: 100,
    })
    nombres!: string;

    @Column({
        length: 100,
    })
    apellidos!: string;

    @Column({
        unique: true,
        length: 20,
    })
    cedula!: string;

    @Column({
        length: 20,
    })
    telefono!: string;

    @Column({
        nullable: true,
        length: 20,
    })
    whatsapp!: string;

    @Column()
    direccion!: string;

    @Column({
        nullable: true,
        type: 'text',
    })
    descripcionDireccion!: string;

    @Column({
        type: 'varchar',
        length: 36,
        nullable: true,
    })
    rutaId!: string | null;
    @Column({
        default: 'ACTIVO',
    })
    estado!: string;

    @Column({
        type: 'varchar',
        length: 36,
    })
    createdById!: string;

    @Column({
        type: 'varchar',
        length: 36,
    })
    barrio!: string;

    @Column({
        type: 'varchar',
        length: 36,
    })
    observacion!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    /**
     * Préstamos asociados al cliente.
     */
    @OneToMany(
        () => Prestamo,
        (prestamo) => prestamo.cliente,
    )
    prestamos!: Prestamo[];
}