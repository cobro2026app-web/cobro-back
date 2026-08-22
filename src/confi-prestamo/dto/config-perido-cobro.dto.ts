import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
} from 'class-validator';

export class ConfigPeridoCobroDto {

  @IsString()
  @IsNotEmpty()
  codigo!: string;

  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsInt({
    message: 'La cantidad de días debe ser un número entero',
  })
  @Min(1)
  cantidadDias!: number;

  @IsBoolean({
    message: 'El campo habilitado debe ser booleano',
  })
  habilitado!: boolean;
}