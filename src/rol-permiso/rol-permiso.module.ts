import { Module } from '@nestjs/common';
import { RolPermisoService } from './rol-permiso.service';
import { RolPermisoController } from './rol-permiso.controller';
import { RolPermiso } from './entities/rol-permiso.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RolPermiso,
    ]),
  ],
  controllers: [RolPermisoController],
  providers: [RolPermisoService],
})
export class RolPermisoModule { }
