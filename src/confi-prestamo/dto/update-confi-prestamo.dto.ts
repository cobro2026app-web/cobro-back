import { PartialType } from '@nestjs/mapped-types';
import { CreateConfiPrestamoDto } from './create-confi-prestamo.dto';

export class UpdateConfiPrestamoDto extends PartialType(CreateConfiPrestamoDto) {}
