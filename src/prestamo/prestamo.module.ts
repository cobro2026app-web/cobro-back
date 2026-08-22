import { Module } from '@nestjs/common';
import { PrestamoService } from './prestamo.service';
import { PrestamoController } from './prestamo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prestamo } from './entities/prestamo.entity';
import { PrestamoFechaPago } from './entities/prestamo.fecha.pago.entity';
import { PermisoModule } from 'src/permiso/permiso.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Prestamo,
      PrestamoFechaPago,
    ]),
        PermisoModule,
    
  ],
  controllers: [PrestamoController],
  providers: [PrestamoService],
})
export class PrestamoModule { }
