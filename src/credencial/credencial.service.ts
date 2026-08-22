import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { JwtService } from '@nestjs/jwt';

import { Credencial } from './entities/credencial.entity';
import { LoginDto } from './dto/login.dto';
import { EstadoCredencial } from 'src/core/enum/enums';
import { EstadoUsuario } from 'src/usuario/entities/usuario.entity';

@Injectable()
export class CredencialService {
  constructor(
    @InjectRepository(Credencial)
    private readonly credencialRepository: Repository<Credencial>,

    private readonly jwtService: JwtService,
  ) { }

  async login(dto: LoginDto) {
    const credencial =
      await this.credencialRepository.findOne({
        where: {
          username: dto.username,
        },
        relations: {
          usuario: {
            rol: true,
          },
        },
      });

    if (!credencial) {
      throw new UnauthorizedException(
        'Usuario o contraseña incorrectos',
      );
    }

    if (credencial.estado !== EstadoCredencial.ACTIVA) {
      throw new UnauthorizedException(
        'La credencial se encuentra inactiva',
      );
    }

    if (credencial.usuario.estado !== EstadoUsuario.ACTIVO) {
      throw new UnauthorizedException(
        'El usuario se encuentra inactivo',
      );
    }

    const passwordValida = dto.password === credencial.passwordHash;

    if (!passwordValida) {
      throw new UnauthorizedException(
        'Usuario o contraseña incorrectos',
      );
    }

    await this.credencialRepository.update(
      credencial.id,
      {
        ultimoLogin: new Date(),
      },
    );

    const payload = {
      sub: credencial.usuario.id,
      username: credencial.username,
      rol: credencial.usuario.rol.codigo,
    };

    const accessToken =
      await this.jwtService.signAsync(payload);

    return {
      accessToken,

      usuario: {
        id: credencial.usuario.id,
        nombre: credencial.usuario.nombre,
        apellido: credencial.usuario.apellido,
        email: credencial.usuario.email,
      },


    };
  }


  async crearCredencial(
    data: {
      usuarioId: string;
      username: string;
      password: string;
    },
    manager: EntityManager,
  ) {
    try {
      const existe =
        await manager.findOne(Credencial, {
          where: {
            username: data.username,
          },
        });

      if (existe) {
        throw new ConflictException(
          'El nombre de usuario ya existe',
        );
      }

      const credencial =
        manager.create(Credencial, {
          usuarioId: data.usuarioId,
          username: data.username,
          passwordHash: data.password,
          estado: EstadoCredencial.ACTIVA,
          ultimoLogin: null,
        });

      return await manager.save(
        Credencial,
        credencial,
      );
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      if (error instanceof Error && 'code' in error && error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(
          'El nombre de usuario ya existe',
        );
      }

      throw new BadRequestException(
        'No se pudo crear la credencial',
      );
    }
  }
}