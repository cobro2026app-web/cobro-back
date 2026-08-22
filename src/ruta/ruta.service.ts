import {
  BadRequestException,
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

        let cobrador = null;

        if (ruta.cobradorId) {
          console.log('4. BUSCANDO COBRADOR', ruta.cobradorId);

          const usuario = await this.usuarioRepository.findOne({
            where: {
              id: ruta.cobradorId,
            },
          });


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
}