import { PartialType } from '@nestjs/mapped-types';
import { CrearPagoDto } from './create-pago.dto';

export class UpdatePagoDto extends PartialType(CrearPagoDto) { }
