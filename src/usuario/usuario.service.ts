import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CrearAdminDto } from './dto/crear.admint.dto';
import { DataSource } from 'typeorm';
import { EstadoUsuario, Usuario } from './entities/usuario.entity';
import { Rol } from 'src/rol/entities/rol.entity';
import { CredencialService } from 'src/credencial/credencial.service';
import { CrearCobradorDto } from './dto/crear-cobrador.dto';
import { EditarCobradorDto } from './dto/editar-cobrador.dto';

@Injectable()
export class UsuarioService {

  constructor(
    private readonly dataSource: DataSource,
    private readonly credencialService: CredencialService,
  ) { }




  async crearAdmin(dto: CrearAdminDto) {
    try {
      return await this.dataSource.transaction(
        async (manager) => {

          // 1. Validar documento
          const usuarioExiste =
            await manager.findOne(Usuario, {
              where: {
                documento: dto.documento,
              },
            });

          if (usuarioExiste) {
            throw new ConflictException(
              'El documento ya está registrado',
            );
          }

          // 2. Validar email
          const emailExiste =
            await manager.findOne(Usuario, {
              where: {
                email: dto.email,
              },
            });

          if (emailExiste) {
            throw new ConflictException(
              'El correo ya está registrado',
            );
          }

          // 3. Obtener rol ADMIN
          const rol =
            await manager.findOne(Rol, {
              where: {
                codigo: 'ADMIN',
              },
            });

          if (!rol) {
            throw new BadRequestException(
              'El rol ADMIN no existe',
            );
          }

          // 4. Crear usuario
          const usuario =
            manager.create(Usuario, {
              nombre: dto.nombre,
              apellido: dto.apellido,
              documento: dto.documento,
              telefono: dto.telefono,
              email: dto.email,
              rol,
              estado: EstadoUsuario.ACTIVO,
            });

          const usuarioGuardado =
            await manager.save(Usuario, usuario);

          // 5. Crear credencial
          await this.credencialService.crearCredencial(
            {
              usuarioId: usuarioGuardado.id,
              username: dto.username,
              password: dto.password,
            },
            manager,
          );

          return {
            exito: true,
            msg: 'Usuario creado correctamente.',
          };
        },
      );
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException(
        'No se pudo crear el usuario',
      );
    }
  }

  //
  ///

  async crearCobrador(
    dto: CrearCobradorDto,
    id: string,
  ) {
    try {
      return await this.dataSource.transaction(
        async (manager) => {

          // 1. Validar documento
          const documentoExiste =
            await manager.findOne(Usuario, {
              where: {
                documento: dto.documento,
              },
            });

          if (documentoExiste) {
            throw new ConflictException(
              'El documento ya está registrado',
            );
          }

          // 2. Validar email si fue enviado
          if (dto.email) {
            const emailExiste =
              await manager.findOne(Usuario, {
                where: {
                  email: dto.email,
                },
              });

            if (emailExiste) {
              throw new ConflictException(
                'El email ya está registrado',
              );
            }
          }

          // 3. Obtener rol COBRADOR
          const rol =
            await manager.findOne(Rol, {
              where: {
                codigo: 'COBRADOR',
              },
            });

          if (!rol) {
            throw new BadRequestException(
              'El rol COBRADOR no existe',
            );
          }

          // 4. Crear usuario
          const usuario =
            manager.create(Usuario, {
              nombre: dto.nombre,
              apellido: dto.apellido,
              documento: dto.documento,
              telefono: dto.telefono,
              email: dto.email,
              rol,
              estado: EstadoUsuario.ACTIVO,
              createdById: id,
            });

          const usuarioGuardado =
            await manager.save(
              Usuario,
              usuario,
            );

          // 5. Crear credencial
          await this.credencialService.crearCredencial(
            {
              usuarioId: usuarioGuardado.id,
              username: dto.username,
              password: dto.password,
            },
            manager,
          );

          return {
            exito: true,
            msg: 'Usuario creado correctamente.',
          };
        },
      );
    } catch (error) {

      // Errores controlados de negocio
      if (error instanceof ConflictException) {
        throw error;
      }

      if (error instanceof BadRequestException) {
        throw error;
      }

      // Error de base de datos
      if (this.esDuplicateKeyError(error)) {
        throw new ConflictException(
          this.obtenerMensajeDuplicateKey(error),
        );
      }

      // Error inesperado
      throw new InternalServerErrorException(
        'Ocurrió un error al crear el cobrador.',
      );
    }
  }

  async obtenerPorRol(
    adminId: string,
    rolCodigo: string = 'COBRADOR',
  ) {

    const resp = await this.dataSource.getRepository(Usuario).find({
      where: {
        createdById: adminId,
        rol: {
          codigo: rolCodigo,
        },
      },
      relations: {
        rol: true,
      },
      order: {
        nombre: 'ASC',
      },
    });

    return {
      exito: true,
      msg: "Operación exitosa.",
      data: resp.map((usuario) => ({
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        documento: usuario.documento,
        telefono: usuario.telefono,
        email: usuario.email,
        estado: usuario.estado,
      }))
    };
  }
  private esDuplicateKeyError(error: any): boolean {
    return (
      error?.code === 'ER_DUP_ENTRY' ||
      error?.code === '23505'
    );
  }


  async obtenerPorId(
    id: string,
    adminId: string,
  ) {
    try {
      const usuario = await this.dataSource
        .getRepository(Usuario)
        .findOne({
          where: {
            id,
            createdById: adminId,
          },
        });

      if (!usuario) {
        throw new NotFoundException(
          'Usuario no encontrado.',
        );
      }

      return {
        exito: true,
        msg: 'Operación exitosa.',
        data: {
          id: usuario.id,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          documento: usuario.documento,
          telefono: usuario.telefono,
          email: usuario.email,
          estado: usuario.estado,
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error(
        'Error al obtener usuario por ID:',
        error,
      );

      throw new BadRequestException(
        'No se pudo obtener la información del usuario.',
      );
    }
  }


  async editarCobradir(id: string, dto: EditarCobradorDto) {
    try {
      const cobrador = await this.dataSource
        .getRepository(Usuario).findOne({
          where: {
            id,
            rol: {
              nombre: 'COBRADOR',
            },
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

      // Validar documento
      const documentoExiste = await this.dataSource
        .getRepository(Usuario).findOne({
          where: {
            id: id,
          },
        });

      if (
        documentoExiste &&
        documentoExiste.id !== id
      ) {
        throw new ConflictException(
          'El documento ya está registrado',
        );
      }

      // Actualizar datos
      cobrador.nombre = dto.nombre;
      cobrador.apellido = dto.apellido;
      cobrador.telefono = dto.telefono;
      cobrador.email = dto.email;

      await this.dataSource
        .getRepository(Usuario).save(cobrador);

      return {
        exito: true,
        msg: 'Operación exitosa.',
        data: {},
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      console.error(error);

      throw new InternalServerErrorException(
        'Error al actualizar el cobrador',
      );
    }
  }

  private obtenerMensajeDuplicateKey(error: any): string {
    const mensaje = error?.driverError?.message ?? error?.message ?? '';

    if (mensaje.includes('email')) {
      return 'El email ya está registrado.';
    }

    if (mensaje.includes('documento')) {
      return 'El documento ya está registrado.';
    }

    if (mensaje.includes('username')) {
      return 'El username ya está registrado.';
    }

    return 'Ya existe un registro con alguno de los datos proporcionados.';
  }




}


