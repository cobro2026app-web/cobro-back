import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class CrearCobradorDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  apellido!: string;

  @IsString()
  @IsNotEmpty()
  documento!: string;

  @IsString()
  @IsNotEmpty()
  telefono!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}