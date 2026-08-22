import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('dias_cobro')
export class DiaCobro {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  adminId!: string;

  @Column()
  diaSemana!: number;

  @Column({
    length: 20,
  })
  nombre!: string;

  @Column({
    default: true,
  })
  habilitado!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}