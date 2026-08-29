import { Module } from '@nestjs/common';

import { AppConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { UsuariosModule } from './usuario/usuario.module';
import { RolModule } from './rol/rol.module';
import { PermisoModule } from './permiso/permiso.module';
import { CredencialModule } from './credencial/credencial.module';
import { RolPermisoModule } from './rol-permiso/rol-permiso.module';
import { ClienteModule } from './cliente/cliente.module';
import { ConfiPrestamoModule } from './confi-prestamo/confi-prestamo.module';
import { PrestamoModule } from './prestamo/prestamo.module';
import { RutaModule } from './ruta/ruta.module';
import { PagoModule } from './pago/pago.module';

@Module({
  imports: [
    AppConfigModule,

    DatabaseModule,
    UsuariosModule,
    RolModule,
    PermisoModule,
    CredencialModule,
    RolPermisoModule,
    ClienteModule,
    ConfiPrestamoModule,
    PrestamoModule,
    RutaModule,
    PagoModule

  ],
})
export class AppModule { }