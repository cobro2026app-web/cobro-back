import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CrearPagoDto } from './dto/create-pago.dto';
import { EstadoPrestamo, FrecuenciaPrestamo, Prestamo } from 'src/prestamo/entities/prestamo.entity';
import { EstadoPago, Pago } from './entities/pago.entity';
import { DataSource } from 'typeorm';
import { ReversarPagoDto } from './dto/reversar-pago-dto';
import { HistoricoPagoDto } from './dto/historico-pago.dto';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { PrestamoFechaPago } from 'src/prestamo/entities/prestamo.fecha.pago.entity';

@Injectable()
export class PagoService {

  constructor(
    private readonly dataSource: DataSource,
  ) { }
  async registrarPago(dto: CrearPagoDto, id: string) {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const prestamo = await manager.findOne(Prestamo, {
          where: {
            id: dto.prestamoId,
          },
        });

        if (!prestamo) {
          throw new NotFoundException('El préstamo no existe');
        }

        if (prestamo.estado !== EstadoPrestamo.ACTIVO) {
          throw new BadRequestException('El préstamo no está activo');
        }

        const valorPago = Number(dto.valor);
        const deudaActual = Number(prestamo.deudaActual);

        if (valorPago <= 0) {
          throw new BadRequestException(
            'El valor del pago debe ser mayor a cero',
          );
        }

        if (valorPago > deudaActual) {
          throw new BadRequestException(
            'El pago no puede superar la deuda actual',
          );
        }

        const pago = manager.create(Pago, {
          prestamoId: prestamo.id,
          valor: valorPago,
          estado: EstadoPago.APLICADO,
          registradoPorId: id,
        });

        await manager.save(Pago, pago);

        // Actualizar deuda
        prestamo.deudaActual = deudaActual - valorPago;

        // Si terminó de pagar
        if (prestamo.deudaActual === 0) {
          prestamo.deudaActual = 0;
          prestamo.estado = EstadoPrestamo.PAGADO;
        }

        await manager.save(Prestamo, prestamo);

        return {
          exito: true,
          msg: "Operación exitosa",
          data: {}
        };
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      console.error('Error al registrar pago:', error);

      throw new InternalServerErrorException(
        'Error al registrar el pago',
      );
    }
  }



  async reversarPago(
    pagoId: string,
    dto: ReversarPagoDto,
    usuarioId: string,
  ) {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const pago = await manager.findOne(Pago, {
          where: { id: pagoId },
          relations: {
            prestamo: true
          },
        });

        if (!pago) {
          throw new NotFoundException('El pago no existe');
        }

        if (pago.estado === EstadoPago.REVERSADO) {
          throw new BadRequestException(
            'El pago ya fue reversado',
          );
        }

        const prestamo = pago.prestamo;

        if (!prestamo) {
          throw new NotFoundException(
            'El préstamo asociado al pago no existe',
          );
        }

        // Restaurar deuda
        const deudaActual = Number(prestamo.deudaActual);
        const valorPago = Number(pago.valor);

        prestamo.deudaActual = deudaActual + valorPago;

        // Si el préstamo estaba marcado como PAGADO, vuelve a ACTIVO
        if (prestamo.estado === EstadoPrestamo.PAGADO) {
          prestamo.estado = EstadoPrestamo.ACTIVO;
        }

        await manager.save(Prestamo, prestamo);

        // Marcar pago como reversado
        pago.estado = EstadoPago.REVERSADO;
        pago.fechaReversion = new Date();
        pago.usuarioReversionId = usuarioId;
        pago.motivoReversion = dto.motivoReversion;

        await manager.save(Pago, pago);

        return {
          exito: true,
          msg: "Operación exitosa.",
          data: {}
        };
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      console.error('Error al reversar pago:', error);

      throw new InternalServerErrorException(
        'Error al reversar el pago',
      );
    }
  }

  async listarPagos(
    prestamoId: string,

  ) {


    const pagos = await this.dataSource.manager.find(Pago, {
      where: { prestamoId },
      order: { createdAt: 'DESC' },
    });

    return {
      exito: true,
      msg: "Operación exitosa.",
      data: pagos
    };
  }



  async crearPrestamoHistorico(
    dto: HistoricoPagoDto,
    creadoPorId: string,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Validar cliente
      const cliente = await queryRunner.manager.findOne(Cliente, {
        where: {
          id: dto.clienteId,
        },
      });

      if (!cliente) {
        throw new NotFoundException(
          'El cliente no existe.',
        );
      }
      const totalPagar =
        dto.monto + dto.montoInteres;
      let pagado = 0;
      if (dto.pagos) {
        pagado = dto.pagos.reduce(
          (total, pago) => total + pago.valor,
          0,
        );
      }

      const fechaInicio =
        this.parseDateOnly(dto.fechaInicio);

      const fechaFin =
        this.parseDateOnly(dto.fechaFin);



      ///Crear prestamo
      const prestamo = queryRunner.manager.create(Prestamo, {
        clienteId: dto.clienteId,
        montoInteres: dto.montoInteres,
        valorCuota: dto.valorCuota,
        creadoPorId,
        monto:
          dto.monto,
        interes:
          dto.interes,
        totalPagar:
          totalPagar,
        numeroCuotas: dto.numeroCuotas,
        frecuencia:
          dto.frecuencia,
        fechaInicio,
        fechaFin,
        deudaActual: totalPagar - pagado,
        estado:
          EstadoPrestamo.ACTIVO,

      });

      const prestamoGuardado =
        await queryRunner.manager.save(Prestamo, prestamo);

      ///Asignar fecha de pago en caso de que se cumpla la condicion
      if (
        dto.frecuencia ===
        FrecuenciaPrestamo.SEMANAL ||
        dto.frecuencia ===
        FrecuenciaPrestamo.QUINCENAL
      ) {
        const fechas = queryRunner.manager.create(
          PrestamoFechaPago,
          dto.fechas?.map((fecha) => ({
            prestamoId: prestamoGuardado.id,
            numero: fecha.numero,
            fechaPago: this.parseDateOnly(fecha.fechaPago),
            valor: fecha.valor,
          })) ?? [],
        );
        await queryRunner.manager.save(PrestamoFechaPago, fechas);
      }
      // Crear todos los pagos históricos
      const pagosCreados: any[] = [];

      for (const pagoDto of dto.pagos) {
        const pago = queryRunner.manager.create(Pago, {
          prestamoId: prestamoGuardado.id,
          registradoPorId: creadoPorId,
          valor: pagoDto.valor,
          fechaPago: new Date(pagoDto.fechaPago),
        });

        const pagoGuardado =
          await queryRunner.manager.save(Pago, pago);

        pagosCreados.push(pagoGuardado);
      }
      await queryRunner.commitTransaction();

      return {
        exito: true,
        msg: 'Préstamo histórico creado correctamente.',
        data: {},
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new BadRequestException(
        'No fue posible crear el préstamo histórico.',
      );
    } finally {
      await queryRunner.release();
    }
  }

  private parseDateOnly(date: string): Date {
    const [year, month, day] =
      date.split('-').map(Number);

    return new Date(
      year,
      month - 1,
      day,
    );
  }
}
