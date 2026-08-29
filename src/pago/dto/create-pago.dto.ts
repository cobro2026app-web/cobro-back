import {
  IsDateString,
  IsNumber,
  IsPositive,
  IsUUID,
} from 'class-validator';

export class CrearPagoDto {
  @IsUUID()
  prestamoId!: string;
  @IsUUID()
  cobradorId!: string;

  @IsNumber()
  @IsPositive()
  valor!: number;

  @IsDateString()
  fechaPago!: string;
}