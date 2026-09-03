import { IsNotEmpty, IsPositive, IsUUID } from "class-validator";

export class CreateCajaDto {

    @IsUUID()
    @IsNotEmpty()
    rutaId!: string;

    @IsPositive()
    @IsNotEmpty()
    montoInicial!: number
}
