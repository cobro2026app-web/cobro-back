import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Usuario } from './entities/usuario.entity';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';
import { CredencialModule } from 'src/credencial/credencial.module';
import { Rol } from 'src/rol/entities/rol.entity';
import { PermisoModule } from 'src/permiso/permiso.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Usuario,
      Rol
    ]),
    CredencialModule,
    PermisoModule
  ],

  controllers: [
    UsuarioController,
  ],

  providers: [
    UsuarioService,
  ],

  exports: [
    TypeOrmModule,
    UsuarioService,
  ],
})
export class UsuariosModule {}