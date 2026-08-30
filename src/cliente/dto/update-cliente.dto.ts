import { PartialType } from '@nestjs/mapped-types';
import { CreateClienteDto } from './create-cliente.dto';
import { CrearClienteDto } from './crear-cliente.dto';

export class UpdateClienteDto extends PartialType(CrearClienteDto) {}
