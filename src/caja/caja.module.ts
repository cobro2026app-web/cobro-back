import { Module } from '@nestjs/common';
import { CajaService } from './caja.service';
import { CajaController } from './caja.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Caja } from './entities/caja.entity';
import { CajaMovimiento } from './entities/caja-movimiento.entity';
import { PermisoModule } from 'src/permiso/permiso.module';

@Module({
  imports:[
     TypeOrmModule.forFeature([
          Caja,
          CajaMovimiento,
        ]),    
        PermisoModule,
  ],
  controllers: [CajaController],
  providers: [CajaService],
})
export class CajaModule {}
