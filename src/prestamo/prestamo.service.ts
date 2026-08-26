import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';

import {
  EstadoPrestamo,
  FrecuenciaPrestamo,
  Prestamo,
} from './entities/prestamo.entity';
import { CrearPrestamoDto } from './dto/create-prestamo.dto';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { PrestamoFechaPago } from './entities/prestamo.fecha.pago.entity';
import { Cliente } from 'src/cliente/entities/cliente.entity';




@Injectable()
export class PrestamoService {
  constructor(
    private readonly dataSource: DataSource,
  ) { }

  async crearPrestamo(
    dto: CrearPrestamoDto,
    creadoPorId: string,
  ) {
    console.log(dto);

    return this.dataSource.transaction(
      async (manager) => {


        const cliente = await manager.findOne(
          Cliente,
          {
            where: {
              id: dto.clienteId,
            },
          },
        );

        if (!cliente) {
          throw new NotFoundException(
            'El cliente no existe',
          );
        }

        const creadoPor = await manager.findOne(
          Usuario,
          {
            where: {
              id: creadoPorId,
            },
          },
        );

        if (!creadoPor) {
          throw new NotFoundException(
            'El usuario que crea el préstamo no existe',
          );
        }



        if (dto.monto <= 0) {
          throw new BadRequestException(
            'El monto debe ser mayor a cero',
          );
        }

        if (dto.interes < 0) {
          throw new BadRequestException(
            'El interés no puede ser negativo',
          );
        }

        if (dto.numeroCuotas <= 0) {
          throw new BadRequestException(
            'El número de cuotas debe ser mayor a cero',
          );
        }

        // =====================================================
        // 4. Calcular total
        // =====================================================

        const totalPagar =
          dto.monto + dto.montoInteres;

        // =====================================================
        // 5. Fecha de inicio
        // =====================================================

        const fechaInicio =
          this.parseDateOnly(dto.fechaInicio);

        const fechaFin =
          this.parseDateOnly(dto.fechaFin);



        const prestamo =
          manager.create(
            Prestamo,
            {
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
              deudaActual:totalPagar,
              estado:
                EstadoPrestamo.ACTIVO,

            },
          );


        const prestamoGuardado = await manager.save(
          Prestamo,
          prestamo,
        );


        if (
          dto.frecuencia ===
          FrecuenciaPrestamo.SEMANAL ||
          dto.frecuencia ===
          FrecuenciaPrestamo.QUINCENAL
        ) {







          const fechas = manager.create(
            PrestamoFechaPago,
            dto.fechas?.map((fecha) => ({
              prestamoId: prestamoGuardado.id,
              numero: fecha.numero,
              fechaPago: this.parseDateOnly(fecha.fechaPago),
              valor: fecha.valor,
            })) ?? [],
          );
          await manager.save(PrestamoFechaPago, fechas);
        }


        return {
          exito: true,
          msg: "Operación exitosa",
          data: []

        };
      },
    );
  }


  async listarPrestamos(id: string) {
    try {
      const prestamos = await this.dataSource
        .getRepository(Prestamo)
        .find({
          where: {
            creadoPorId: id,
          },
          relations: {
            fechasPago: true,
            cliente:true
          },
          select:{
            cliente:{
              id:true,
              nombres:true,
              apellidos:true,
              cedula:true,
            }
          },
          order: {
            createdAt: 'DESC',
          },
        });

      return {
        exito: true,
        msg: "Operación exitosa",
        data: prestamos
      };

    } catch (error) {

      console.error(
        'Error listando préstamos:',
        error,
      );

      throw new InternalServerErrorException(
        'No fue posible listar los préstamos',
      );
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