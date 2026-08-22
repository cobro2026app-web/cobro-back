import { Module } from '@nestjs/common';
import { RutaService } from './ruta.service';
import { RutaController } from './ruta.controller';
import { Ruta } from './entities/ruta.entity';
import { PermisoModule } from 'src/permiso/permiso.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosModule } from 'src/usuario/usuario.module';
import { ClienteModule } from 'src/cliente/cliente.module';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Cliente } from 'src/cliente/entities/cliente.entity';

@Module({
    imports: [
      TypeOrmModule.forFeature([
        Ruta,
        Usuario,
        Cliente
      ]),
  
      PermisoModule,
    ],
  controllers: [RutaController],
  providers: [RutaService],
})
export class RutaModule {}
