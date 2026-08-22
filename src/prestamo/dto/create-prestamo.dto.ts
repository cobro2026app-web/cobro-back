import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

import { FrecuenciaPrestamo } from '../entities/prestamo.entity';
import { CrearPrestamoFechaDto } from './crear.fecha.prestamo.dto';
import { Type } from 'class-transformer';

export class CrearPrestamoDto {

  @IsUUID()
  usuarioId!: string;

  @IsNumber(
    {
      maxDecimalPlaces: 2,
    },
  )
  @Min(1)
  monto!: number;

  @IsNumber(
    {
      maxDecimalPlaces: 2,
    },
  )
  @Min(0)
  interes!: number;

  @Min(0)
  montoInteres!: number;

  @IsInt()
  @Min(1)
  numeroCuotas!: number;

  @IsInt()
  @Min(1)
  valorCuota!: number;

  @IsEnum(FrecuenciaPrestamo)
  frecuencia!: FrecuenciaPrestamo;

  @IsDateString()
  fechaInicio!: string;

  @IsDateString()
  fechaFin!: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CrearPrestamoFechaDto)
  fechas?: CrearPrestamoFechaDto[];
}