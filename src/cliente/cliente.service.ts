import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Cliente } from './entities/cliente.entity';

import { CrearClienteDto } from './dto/crear-cliente.dto';
import { EstadoUsuario, Usuario } from 'src/usuario/entities/usuario.entity';
import { EstadoPrestamo } from 'src/prestamo/entities/prestamo.entity';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Ruta } from 'src/ruta/entities/ruta.entity';
import { log } from 'node:console';

@Injectable()
export class ClienteService {

  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository:
      Repository<Cliente>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository:
      Repository<Usuario>,
    @InjectRepository(Ruta)
    private readonly rutaRepository:
      Repository<Ruta>,
  ) { }

  async crear(
    dto: CrearClienteDto,
    usuarioId: string,
  ) {
    const existe = await this.clienteRepository.findOne({
      where: {
        cedula: dto.cedula,
      },
    });

    if (existe) {
      throw new ConflictException(
        'Ya existe un cliente con esta cédula',
      );
    }

    try {


      const usuario = await this.usuarioRepository.findOne({
        where: {
          id: usuarioId,

        },
        relations: {
          rol: true,
        },
      });

      if (!usuario) {
        throw new NotFoundException(
          'Usuario no encontrado',
        );
      }

      let adminId: string;

      if (usuario.rol.codigo === 'ADMIN') {
        adminId = usuario.id;
      } else if (usuario.rol.codigo === 'COBRADOR') {

        if (!usuario.createdById) {
          throw new BadRequestException(
            'El cobrador no tiene un administrador asignado',
          );
        }

        adminId = usuario.createdById;

      } else {
        throw new ForbiddenException(
          'El usuario no tiene permisos para crear clientes',
        );
      }

      const cliente =
        this.clienteRepository.create({
          nombres: dto.nombres,
          apellidos: dto.apellidos,
          cedula: dto.cedula,
          telefono: dto.telefono,
          whatsapp: dto.whatsapp,
          rutaId: dto.rutaId,
          direccion: dto.direccion,
          barrio: dto.barrio,
          observacion: dto.observacion,
          descripcionDireccion:
            dto.descripcionDireccion,
          estado: EstadoUsuario.ACTIVO,

          createdById: adminId,

        });

      await this.clienteRepository.save(cliente);

      return {
        exito: true,
        msg: 'Cliente creado correctamente.',
      };

    } catch (error) {

      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new BadRequestException(
        'No se pudo crear el cliente',
      );
    }
  }
  async listar(usuarioId: string) {

    const usuario = await this.usuarioRepository.findOne({
      where: {
        id: usuarioId,
      },
      relations: {
        rol: true,

      },
    });

    if (!usuario) {
      throw new NotFoundException(
        'Usuario no encontrado',
      );
    }

    let adminId: string;

    if (usuario.rol.codigo === 'ADMIN') {

      adminId = usuario.id;

    } else if (usuario.rol.codigo === 'COBRADOR') {

      if (!usuario.createdById) {
        throw new BadRequestException(
          'El cobrador no tiene un administrador asignado',
        );
      }

      adminId = usuario.createdById;

    } else {

      throw new ForbiddenException(
        'El usuario no tiene permisos para consultar clientes',
      );
    }

    const clientes = await this.clienteRepository
      .createQueryBuilder('cliente')
      .leftJoin(
        'cliente.prestamos',
        'prestamo',
        'prestamo.estado = :estado',
        {
          estado: EstadoPrestamo.ACTIVO,
        },
      )
      .leftJoinAndSelect(
        'prestamo.fechasPago',
        'fechaPago',
      )
      .where('cliente.createdById = :adminId', {
        adminId,
      })
      .select([
        'cliente.id',
        'cliente.nombres',
        'cliente.apellidos',
        'cliente.cedula',
        'cliente.telefono',
        'cliente.whatsapp',
        'cliente.direccion',
        'cliente.descripcionDireccion',
        'cliente.estado',
        'cliente.rutaId',

        'prestamo.id',
        'prestamo.totalPagar',
        'prestamo.frecuencia',
        'prestamo.deudaActual',

        'fechaPago.id',
        'fechaPago.fechaPago',
        'fechaPago.numero',
      ])
      .orderBy('cliente.nombres', 'ASC')
      .getMany();

    return {
      exito: true,
      msg: "Operación exitosa.",
      data: clientes.map((cliente) => ({
        id: cliente.id,
        nombres: cliente.nombres,
        apellidos: cliente.apellidos,
        cedula: cliente.cedula,
        telefono: cliente.telefono,
        whatsapp: cliente.whatsapp,
        direccion: cliente.direccion,
        descripcionDireccion:
          cliente.descripcionDireccion,
        estado: cliente.estado,
        rutaId: cliente.rutaId,
        totalPrestado: cliente.prestamos.reduce(
          (total, prestamo) => total + prestamo.deudaActual,
          0,
        ),
      }))
    };
  }

  async clienteById(id: string) {
    try {
      const res = await this.clienteRepository.findOne({

        where: { id }, relations: {

          prestamos: true

        },

      });

      return {
        exito: true,
        msg: "Operación éxitosa",
        data: res,
      }
    } catch (error) {

    }
  }
  async actualizar(
    id: string,
    dto: UpdateClienteDto,
    usuarioId: string,
  ) {
    // 1. Obtener el usuario que realiza la modificación
    const usuario = await this.usuarioRepository.findOne({
      where: {
        id: usuarioId,
      },
      relations: {
        rol: true,
      },
    });

    if (!usuario) {
      throw new NotFoundException(
        'Usuario no encontrado',
      );
    }

    // 2. Determinar el administrador propietario
    let adminId: string;

    if (usuario.rol.codigo === 'ADMIN') {
      adminId = usuario.id;
    } else if (usuario.rol.codigo === 'COBRADOR') {
      if (!usuario.createdById) {
        throw new BadRequestException(
          'El cobrador no tiene un administrador asignado',
        );
      }

      adminId = usuario.createdById;
    } else {
      throw new ForbiddenException(
        'El usuario no tiene permisos para actualizar clientes',
      );
    }

    // 3. Buscar el cliente
    const cliente = await this.clienteRepository.findOne({
      where: {
        id,
        createdById: adminId,
      },
    });

    if (!cliente) {
      throw new NotFoundException(
        'Cliente no encontrado',
      );
    }

    // 4. Validar cédula si viene en la actualización
    if (
      dto.cedula &&
      dto.cedula !== cliente.cedula
    ) {
      const existe =
        await this.clienteRepository.findOne({
          where: {
            cedula: dto.cedula,
          },
        });

      if (existe && existe.id !== cliente.id) {
        throw new ConflictException(
          'Ya existe un cliente con esta cédula',
        );
      }
    }

    // 5. Validar ruta si viene en la actualización
    if (
      dto.rutaId &&
      dto.rutaId !== cliente.rutaId
    ) {
      const ruta = await this.rutaRepository.findOne({
        where: {
          id: dto.rutaId,
          adminId,
          habilitada: true,
        },
      });

      if (!ruta) {
        throw new BadRequestException(
          'La ruta no existe, está deshabilitada o no pertenece al administrador',
        );
      }
    }

    // 6. Actualizar únicamente lo recibido
    Object.assign(cliente, dto);

    try {
      console.log(cliente);

      await this.clienteRepository.save(cliente);

      return {
        exito: true,
        msg: 'Cliente actualizado correctamente',
        data: {

        },
      };
    } catch (error) {
      throw new BadRequestException(
        'No se pudo actualizar el cliente',
      );
    }
  }
  async buscarClientes(texto?: string) {
    try {
      const termino = texto?.trim() ?? '';
      log

      if (!termino) {
        return [];
      }

      const query = await this.clienteRepository
        .createQueryBuilder('cliente')
        .where(
          `
        LOWER(cliente.nombres) LIKE LOWER(:termino)
        OR LOWER(cliente.apellidos) LIKE LOWER(:termino)
        OR cliente.cedula LIKE :termino
        OR LOWER(
          CONCAT(cliente.nombres, ' ', cliente.apellidos)
        ) LIKE LOWER(:termino)
        `,
          {
            termino: `%${termino}%`,
          },
        )
        .take(20)
        .getMany();


      return {
        exito:true,
        msg:"Operación exitosa.",
        data:query
      };
    } catch (error) {
      console.error('Error al buscar clientes:', error);

      throw new InternalServerErrorException(
        'Error al buscar los clientes',
      );
    }
  }
}