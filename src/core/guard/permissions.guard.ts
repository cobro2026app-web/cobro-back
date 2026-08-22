import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { PermisoService } from 'src/permiso/permiso.service';

import {
  PERMISSION_KEY,
} from '../decorator/require-permission.decorator';

@Injectable()
export class PermissionsGuard
  implements CanActivate {

  constructor(
    private readonly reflector: Reflector,

    private readonly permisoService:
      PermisoService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const permiso =
      this.reflector.get<string>(
        PERMISSION_KEY,
        context.getHandler(),
      );

    // Endpoint sin permiso requerido
    if (!permiso) {
      return true;
    }

    const request =
      context.switchToHttp().getRequest();

    const user = request.user;

    if (!user) {
      throw new ForbiddenException(
        'Usuario no autenticado',
      );
    }

    const tienePermiso =
      await this.permisoService.rolTienePermiso(
        user.rol,
        permiso,
      );

    if (!tienePermiso) {
      throw new ForbiddenException(
        'No tienes permisos para realizar esta acción',
      );
    }

    return true;
  }
}