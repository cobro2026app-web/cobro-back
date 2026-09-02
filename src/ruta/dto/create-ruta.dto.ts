import {
  IsBoolean,
  IsOptional,
  IsPositive,
  isPositive,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CrearRutaDto {

  @IsString()
  @MaxLength(100)
  nombre!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  descripcion?: string;

  @IsOptional()
  @IsPositive()
  @MaxLength(255)
  capital!: number;
  

  @IsOptional()
  @IsUUID()
  cobradorId?: string;

  @IsOptional()
  @IsBoolean()
  habilitada?: boolean;
}