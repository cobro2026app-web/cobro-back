import {
  IsNumber,
  Max,
  Min,
} from 'class-validator';

export class ConfigPrestamoDto {

  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message: 'El interés debe ser un número válido',
    },
  )
  @Min(0)
  @Max(100)
  interesDefault!: number;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message: 'El seguro debe ser un número válido',
    },
  )
  @Min(0)
  @Max(100)
  seguroDefault!: number;
}