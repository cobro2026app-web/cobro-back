import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import {
  DataSource,
  QueryRunner,
  Repository,
} from 'typeorm';

import { ConfiguracionDto } from './dto/configuracion.dto';
import { ConfiPrestamo } from './entities/confi-prestamo.entity';
import { DiaCobro } from './entities/dias-cobro.entity';
import { PeriodoCobro } from './entities/periodo-cobro.entity';

@Injectable()
export class ConfiPrestamoService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(ConfiPrestamo)
    private readonly configPrestamoRepository: Repository<ConfiPrestamo>,

    @InjectRepository(DiaCobro)
    private readonly configDiasCobroRepository: Repository<DiaCobro>,

    @InjectRepository(PeriodoCobro)
    private readonly configPeriodoCobroRepository: Repository<PeriodoCobro>,
  ) { }

  async guardarConfiguracion(dto: ConfiguracionDto, adminId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.upsertConfigPrestamo(queryRunner, dto, adminId);
      await this.upsertDiasCobro(queryRunner, dto, adminId);
      await this.upsertPeriodosCobro(queryRunner, dto, adminId);

      await queryRunner.commitTransaction();
      return { message: 'Configuración guardada correctamente' };
    } catch {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('No fue posible guardar la configuración');
    } finally {
      await queryRunner.release();
    }
  }

  // ── Privados ────────────────────────────────────────────────────────────────

  private async upsertConfigPrestamo(queryRunner: QueryRunner, dto: ConfiguracionDto, adminId: string) {
    let config = await queryRunner.manager.findOne(ConfiPrestamo, { where: { adminId } });

    if (config) {
      config.interesDefault = dto.configuracion.interesDefault;
      config.seguroDefault = dto.configuracion.seguroDefault;
    } else {
      config = queryRunner.manager.create(ConfiPrestamo, {
        adminId,
        interesDefault: dto.configuracion.interesDefault,
        seguroDefault: dto.configuracion.seguroDefault,
      });
    }

    await queryRunner.manager.save(ConfiPrestamo, config);
  }

  private async upsertDiasCobro(queryRunner: QueryRunner, dto: ConfiguracionDto, adminId: string) {
    for (const dia of dto.diasCobro) {
      let config = await queryRunner.manager.findOne(DiaCobro, {
        where: { adminId, diaSemana: dia.diaSemana },
      });

      if (config) {
        config.habilitado = dia.habilitado;
      } else {
        config = queryRunner.manager.create(DiaCobro, {
          adminId,
          diaSemana: dia.diaSemana,
          habilitado: dia.habilitado,
          nombre: dia.nombre
        });
      }

      await queryRunner.manager.save(DiaCobro, config);
    }
  }

  private async upsertPeriodosCobro(queryRunner: QueryRunner, dto: ConfiguracionDto, adminId: string) {
    for (const periodo of dto.periodosCobro) {
      let config = await queryRunner.manager.findOne(PeriodoCobro, {
        where: { adminId, codigo: periodo.codigo },
      });

      if (config) {
        config.nombre = periodo.nombre;
        config.cantidadDias = periodo.cantidadDias;
        config.habilitado = periodo.habilitado;
      } else {
        config = queryRunner.manager.create(PeriodoCobro, {
          adminId,
          codigo: periodo.codigo,
          nombre: periodo.nombre,
          cantidadDias: periodo.cantidadDias,
          habilitado: periodo.habilitado,
        });
      }

      await queryRunner.manager.save(PeriodoCobro, config);
    }
  }

  async obtenerConfiguracion(adminId: string) {

    const [
      configuracion,
      diasCobro,
      periodosCobro,
    ] = await Promise.all([

      this.configPrestamoRepository.findOne({
        where: {
          adminId,
        },
      }),

      this.configDiasCobroRepository.find({
        where: {
          adminId,
        },
        order: {
          diaSemana: 'ASC',
        },
      }),

      this.configPeriodoCobroRepository.find({
        where: {
          adminId,
        },
        order: {
          cantidadDias: 'ASC',
        },
      }),

    ]);

    return {
      exito: true,
      msg: "Operación exitosa",
      data: {
        configuracion,
        diasCobro,
        periodosCobro,
      }
    };
  }
}