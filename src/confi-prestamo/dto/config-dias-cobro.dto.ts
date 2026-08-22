import {
    IsBoolean,
    IsInt,
    IsNotEmpty,
    IsString,
    Max,
    Min,
} from 'class-validator';

export class ConfigDiasCobroDro {

    @IsInt({
        message: 'El día de la semana debe ser un número entero',
    })
    @Min(1)
    @Max(7)
    diaSemana!: number;

    @IsBoolean({
        message: 'El campo habilitado debe ser booleano',
    })
    habilitado!: boolean;

    @IsString()
    @IsNotEmpty()
    nombre!: string;
}