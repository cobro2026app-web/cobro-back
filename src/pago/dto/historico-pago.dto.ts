import { Type } from "class-transformer";
import { IsArray, IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsUUID, Min, ValidateNested } from "class-validator";
import { CrearPrestamoFechaDto } from "src/prestamo/dto/crear.fecha.prestamo.dto";
import { FrecuenciaPrestamo } from "src/prestamo/entities/prestamo.entity";
import { CrearPagoDto } from "./create-pago.dto";

export class HistoricoPagoDto {

    @IsUUID()
    clienteId!: string;

    @IsNumber(
        {
            maxDecimalPlaces: 2,
        },
    )
    @Min(1)
    monto!: number;

    @IsNumber(
        {
            maxDecimalPlaces: 2,
        },
    )
    @Min(0)
    interes!: number;

    @Min(0)
    montoInteres!: number;

    @IsInt()
    @Min(1)
    numeroCuotas!: number;

    @IsInt()
    @Min(1)
    valorCuota!: number;

    @IsEnum(FrecuenciaPrestamo)
    frecuencia!: FrecuenciaPrestamo;

    @IsDateString()
    fechaInicio!: string;

    @IsDateString()
    fechaFin!: string;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CrearPrestamoFechaDto)
    fechas?: CrearPrestamoFechaDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CrearPagoDto)
    pagos!: CrearPagoDto[];
}