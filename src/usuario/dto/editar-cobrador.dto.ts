import {
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class EditarCobradorDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  apellido!: string;

  
  @IsString()
  @IsNotEmpty()
  telefono!: string;

  @IsEmail()
  email!: string;
}