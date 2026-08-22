import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RolPermiso } from 'src/rol-permiso/entities/rol-permiso.entity';

@Injectable()
export class PermisoService {

  constructor(
    @InjectRepository(RolPermiso)
    private readonly rolPermisoRepository:
      Repository<RolPermiso>,
  ) { }

  async rolTienePermiso(
    rolCodigo: string,
    permisoCodigo: string,
  ): Promise<boolean> {

    const relacion =
      await this.rolPermisoRepository.findOne({
        where: {
          rol: {
            codigo: rolCodigo,
          },

          permiso: {
            codigo: permisoCodigo,
          },
        },
      });

    return !!relacion;
  }
}