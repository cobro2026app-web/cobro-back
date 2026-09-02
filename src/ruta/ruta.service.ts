import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Ruta } from './entities/ruta.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { CrearRutaDto } from './dto/create-ruta.dto';
import { log } from 'node:console';
import { ActualizarRutaDto } from './dto/update-ruta.dto';
import { EstadoPrestamo } from 'src/prestamo/entities/prestamo.entity';


@Injectable()
export class RutaService {
  constructor(
    @InjectRepository(Ruta)
    private readonly rutaRepository: Repository<Ruta>,

    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,

    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) { }

  // ============================================================
  // CREAR RUTA
  // ============================================================

  async crear(
    dto: CrearRutaDto,
    adminId: string,
  ) {
    try {
      let cobradorId: string | null = null;

      // Si viene cobrador, validar que pertenezca al admin
      if (dto.cobradorId) {
        const cobrador =
          await this.usuarioRepository.findOne({
            where: {
              id: dto.cobradorId,
              createdById: adminId,
              rol: {
                codigo: 'COBRADOR',
              },
            },
            relations: {
              rol: true,
            },
          });

        if (!cobrador) {
          throw new BadRequestException(
            'El cobrador no pertenece a este administrador',
          );
        }

        cobradorId = cobrador.id;
      }

      const ruta = this.rutaRepository.create({
        nombre: dto.nombre,
        descripcion: dto.descripcion ?? null,
        habilitada: dto.habilitada ?? true,
        adminId,
        cobradorId,
        capital:dto.capital
      });

      const rutaGuardada =
        await this.rutaRepository.save(ruta);

      return {
        exito: true,
        msg: 'Operacion exitosa',
        data: {

        },
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException(
        'No se pudo crear la ruta',
      );
    }
  }

  // ============================================================
  // LISTAR RUTAS DEL ADMIN
  // ============================================================

  async listar(adminId: string) {
    console.log('1. INICIO listar', adminId);

    const rutas = await this.rutaRepository.find({
      where: {
        adminId,
      },
      order: {
        nombre: 'ASC',
      },
    });


    const resultado = await Promise.all(
      rutas.map(async (ruta) => {

        let cobrador;

        if (ruta.cobradorId) {
          console.log('4. BUSCANDO COBRADOR', ruta.cobradorId);

          const usuario = await this.usuarioRepository.findOne({
            where: {
              id: ruta.cobradorId,
            },
          });

          cobrador = {

            id: usuario?.id,
            nombre: usuario?.nombre,
            apellido: usuario?.apellido,
          };


        }

        console.log('6. CONTANDO CLIENTES', ruta.id);


        const clientes = await this.clienteRepository.count({
          where: {
            rutaId: ruta.id
          }
        });




        return {
          id: ruta.id,
          nombre: ruta.nombre,
          descripcion: ruta.descripcion,
          habilitada: ruta.habilitada,
          capital:ruta.capital,
          cobrador,
          cantidadClientes: clientes,
          createdAt: ruta.createdAt,
          updatedAt: ruta.updatedAt,
        };
      }),
    );

    console.log('8. RESULTADO GENERADO');

    return {
      exito: true,
      msg: 'Rutas obtenidas correctamente',
      data: resultado,
    };
  }


  async editarRuta(
    id: string,
    dto: ActualizarRutaDto,
  ) {
    const ruta = await this.rutaRepository.findOne({
      where: { id },
    });

    if (!ruta) {
      throw new NotFoundException('La ruta no existe');
    }

    if (dto.cobradorId !== undefined) {
      const cobrador = await this.usuarioRepository.findOne({
        where: {
          id: dto.cobradorId,
        },
        relations: {
          rol: true,
        },
      });

      if (!cobrador) {
        throw new NotFoundException(
          'El cobrador no existe',
        );
      }

      if (cobrador.rol.codigo !== 'COBRADOR') {
        throw new BadRequestException(
          'El usuario seleccionado no es un cobrador',
        );
      }

      const rutaAsignada =
        await this.rutaRepository.findOne({
          where: {
            cobradorId: dto.cobradorId,
          },
        });

      if (
        rutaAsignada &&
        rutaAsignada.id !== id
      ) {
        throw new ConflictException(
          'El cobrador ya tiene una ruta asignada',
        );
      }
    }

    if (dto.nombre !== undefined) {
      ruta.nombre = dto.nombre;
    }

    if (dto.descripcion !== undefined) {
      ruta.descripcion = dto.descripcion;
    }

    if (dto.cobradorId !== undefined) {
      ruta.cobradorId = dto.cobradorId;
    }

    if (dto.habilitada !== undefined) {
      ruta.habilitada = dto.habilitada;
    }

    await this.rutaRepository.save(ruta);

    return {
      exito: true,
      msg: 'Operación exitosa.',
      data: {},
    };
  }

  async listarClientesRutas(idRuta: string) {

    try {
      const clientes = await this.clienteRepository
        .createQueryBuilder('cliente')
        .leftJoinAndSelect(
          'cliente.prestamos',
          'prestamo',
          'prestamo.estado = :estado',
          {
            estado: EstadoPrestamo.ACTIVO,
          },
        )
        .where('cliente.rutaId = :idRuta', {
          idRuta,
        })
        .select([
          'cliente.id',
          'cliente.nombres',
          'cliente.apellidos',
          'cliente.cedula',
          'cliente.estado',
          'cliente.telefono',

          'prestamo.deudaActual',
        ])
        .getMany();

      const data = clientes.map((cliente) => ({
        cliente: {
          id: cliente.id,
          nombres: cliente.nombres,
          apellidos: cliente.apellidos,
          cedula: cliente.cedula,
          telefono: cliente.telefono,
          estado: cliente.estado,
        },
        deudaActual: cliente.prestamos.reduce(
          (total, prestamo) => total + Number(prestamo.deudaActual || 0),
          0,
        ),
      }));

      return {
        exito: true,
        msg: 'Operación exitosa.',
        data,
      };
    } catch (error) {

    }
  }

}