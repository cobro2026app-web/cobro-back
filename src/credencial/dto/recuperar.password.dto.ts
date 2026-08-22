import { IsEmail, IsNotEmpty } from 'class-validator';

export class RecuperarPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}