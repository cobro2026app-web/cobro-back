import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';

export class CrearPrestamoFechaDto {

  @IsUUID()
  @IsNotEmpty()
  prestamoId!: string;

  @IsInt()
  @Min(1)
  numero!: number;

  @IsDateString()
  fechaPago!: string;

  @IsNumber(
    {
      maxDecimalPlaces: 2,
    },
  )
  @Min(0)
  valor!: number;
}