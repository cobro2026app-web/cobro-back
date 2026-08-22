import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('periodos_cobro')
export class PeriodoCobro {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  adminId!: string;

  @Column({
    length: 20,
  })
  codigo!: string;

  @Column({
    length: 50,
  })
  nombre!: string;

  @Column()
  cantidadDias!: number;
  
  @Column()
  cuotas!: number;

  @Column({
    default: true,
  })
  habilitado!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}