import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Cliente } from './entities/cliente.entity';
import { ClienteController } from './cliente.controller';
import { ClienteService } from './cliente.service';

import { PermisoModule } from 'src/permiso/permiso.module';
import { Usuario } from 'src/usuario/entities/usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cliente,
      Usuario
    ]),

    PermisoModule,
  ],

  controllers: [
    ClienteController,
  ],

  providers: [
    ClienteService,
  ],

  exports: [
    ClienteService,
  ],
})
export class ClienteModule { }