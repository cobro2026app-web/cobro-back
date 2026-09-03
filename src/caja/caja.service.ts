import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';

import { Caja, EstadoCaja } from './entities/caja.entity';
import { Ruta } from '../ruta/entities/ruta.entity';
import { DiaCobro } from 'src/confi-prestamo/entities/dias-cobro.entity';
import { CreateCajaDto } from './dto/create-caja.dto';

@Injectable()
export class CajaService {
  constructor(
    private readonly dataSource: DataSource,
  ) { }

  async crearCaja(
    dto: CreateCajaDto,
    usuarioId: string,
  ) {
    const { rutaId, montoInicial } = dto;
    if (!rutaId) {
      throw new BadRequestException(
        'La ruta es obligatoria',
      );
    }

    if (!usuarioId) {
      throw new BadRequestException(
        'El usuario es obligatorio',
      );
    }

    if (
      montoInicial === undefined ||
      montoInicial === null ||
      montoInicial <= 0
    ) {
      throw new BadRequestException(
        'El monto inicial debe ser mayor a cero',
      );
    }

    return this.dataSource.transaction(
      async (manager) => {
        const rutaRepository = manager.getRepository(Ruta);
        const diaCobroRepository =
          manager.getRepository(DiaCobro);
        const cajaRepository = manager.getRepository(Caja);

        // 1. Buscar ruta
        const ruta = await rutaRepository.findOne({
          where: {
            id: rutaId,
          },
        });

        if (!ruta) {
          throw new NotFoundException(
            'La ruta no existe',
          );
        }

        // 2. Obtener fecha actual
        const ahora = new Date();

        /**
         * JavaScript:
         * 0 = Domingo
         * 1 = Lunes
         * 2 = Martes
         * ...
         * 6 = Sábado
         *
         * Tu tabla utiliza:
         * 1 = Lunes
         * ...
         * 7 = Domingo
         */
        const diaSemana =
          ahora.getDay() === 0
            ? 7
            : ahora.getDay();

        // 3. Validar día de cobro
        const diaCobro =
          await diaCobroRepository.findOne({
            where: {
              adminId: ruta.adminId,
              diaSemana,
              habilitado: true,
            },
          });

        if (!diaCobro) {
          throw new BadRequestException(
            'Hoy no está habilitado para realizar cobros',
          );
        }

        // 4. Fecha de operación
        const fechaOperacion =
          this.obtenerFechaOperacion();

        // 5. Verificar si ya existe una caja para
        //    esta ruta en el día actual
        const cajaExistente =
          await cajaRepository.findOne({
            where: {
              rutaId,
              fechaOperacion,
            },
          });

        if (cajaExistente) {
          if (
            cajaExistente.estado ===
            EstadoCaja.ABIERTA
          ) {
            throw new BadRequestException(
              'La ruta ya tiene una caja abierta para hoy',
            );
          }

          throw new BadRequestException(
            'Ya existe una caja registrada para esta ruta el día de hoy',
          );
        }

        // 6. Crear caja
        const caja = cajaRepository.create({
          rutaId,
          abiertaPorId: usuarioId,

          fechaOperacion,

          montoInicial,

          // Al momento de abrir:
          // esperado = inicial
          montoEsperado: montoInicial,

          montoReal: null,
          diferencia: null,

          estado: EstadoCaja.ABIERTA,

          fechaApertura: ahora,
          fechaCierre: null,
        });

        await cajaRepository.save(caja);

        return {
          exito: true,
          msg: "Operación exitosa.",
          data: {}
        };
      },
    );
  }

  private obtenerFechaOperacion(): string {
    const fecha = new Date();

    const year = fecha.getFullYear();

    const month = String(
      fecha.getMonth() + 1,
    ).padStart(2, '0');

    const day = String(
      fecha.getDate(),
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}