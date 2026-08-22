import { Module } from '@nestjs/common';
import { PermisoService } from './permiso.service';
import { PermisoController } from './permiso.controller';
import { Permiso } from './entities/permiso.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolPermiso } from 'src/rol-permiso/entities/rol-permiso.entity';
import { PermissionsGuard } from 'src/core/guard/permissions.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Permiso,
      RolPermiso
    ]),
  ],
  controllers: [PermisoController],
  providers: [PermisoService,
    PermissionsGuard

  ],
  exports: [
    PermisoService,
    PermissionsGuard
  ]
})
export class PermisoModule { }
