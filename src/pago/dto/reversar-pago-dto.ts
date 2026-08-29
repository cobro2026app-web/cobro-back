import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ReversarPagoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  motivoReversion!: string;
}