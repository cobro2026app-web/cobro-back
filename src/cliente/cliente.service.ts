import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Cliente } from './entities/cliente.entity';

import { CrearClienteDto } from './dto/crear-cliente.dto';
import { EstadoUsuario, Usuario } from 'src/usuario/entities/usuario.entity';

@Injectable()
export class ClienteService {

  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository:
      Repository<Cliente>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository:
      Repository<Usuario>,
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
          rutaId:dto.rutaId,
          direccion: dto.direccion,
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

    const clientes =
      await this.clienteRepository.find({
        where: {
          createdById: adminId,
        },
        order: {
          nombres: 'ASC',
        },
      });

      console.log(clientes);
      
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
        rutaId:cliente.rutaId
      }))
    };
  }
}