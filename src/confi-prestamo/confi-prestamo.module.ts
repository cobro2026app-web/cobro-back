import { Module } from '@nestjs/common';
import { ConfiPrestamoService } from './confi-prestamo.service';
import { ConfiPrestamoController } from './confi-prestamo.controller';
import { ConfiPrestamo } from './entities/confi-prestamo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaCobro } from './entities/dias-cobro.entity';
import { PeriodoCobro } from './entities/periodo-cobro.entity';
import { PermisoModule } from 'src/permiso/permiso.module';

@Module({
  imports:[
      TypeOrmModule.forFeature([
          ConfiPrestamo,
          DiaCobro,
          PeriodoCobro

        ]),
        PermisoModule
  ],
  controllers: [ConfiPrestamoController],
  providers: [ConfiPrestamoService],
})
export class ConfiPrestamoModule {}
