import {
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class CambiarPasswordDto {
  @IsString()
  @IsNotEmpty()
  token!: string;

  @IsString()
  @MinLength(8)
  nuevaPassword!: string;
}