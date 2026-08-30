import { Module } from '@nestjs/common';
import { PagoService } from './pago.service';
import { PagoController } from './pago.controller';
import { Pago } from './entities/pago.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prestamo } from 'src/prestamo/entities/prestamo.entity';
import { PermisoModule } from 'src/permiso/permiso.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Pago,
      Prestamo
    ]),
    PermisoModule,

  ], 
  controllers: [PagoController],
  providers: [PagoService],
})
export class PagoModule { }

