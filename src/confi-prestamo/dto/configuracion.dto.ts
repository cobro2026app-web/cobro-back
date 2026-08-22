import {
  Type,
} from 'class-transformer';

import {
  ValidateNested,
  IsArray,
} from 'class-validator';
import { ConfigPrestamoDto } from './config-prestamo.dto';
import { ConfigDiasCobroDro } from './config-dias-cobro.dto';
import { ConfigPeridoCobroDto } from './config-perido-cobro.dto';


export class ConfiguracionDto {

  @ValidateNested()
  @Type(() => ConfigPrestamoDto)
  configuracion!: ConfigPrestamoDto;


  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConfigDiasCobroDro)
  diasCobro!: ConfigDiasCobroDro[];


  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConfigPeridoCobroDto)
  periodosCobro!: ConfigPeridoCobroDto[];
}