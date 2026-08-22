import { PartialType } from '@nestjs/mapped-types';
import { CrearPrestamoDto } from './create-prestamo.dto';

export class UpdatePrestamoDto extends PartialType(CrearPrestamoDto) {}
