import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CrearClienteDto {

  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  nombres!: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  apellidos!: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 20)
  cedula!: string;

  @IsString()
  @IsNotEmpty()
  @Length(7, 20)
  telefono!: string;

  @IsString()
  @IsOptional()
  @Length(7, 20)
  whatsapp!: string;

  @IsString()
  @IsNotEmpty()
  direccion!: string;

  @IsString()
  @IsOptional()
  descripcionDireccion?: string;

  @IsString()
  @IsOptional()
  rutaId?: string;
}