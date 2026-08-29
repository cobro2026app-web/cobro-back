import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CrearAdminDto } from './dto/crear.admint.dto';
import { CrearCobradorDto } from './dto/crear-cobrador.dto';
import { JwtAuthGuard } from 'src/core/guard/jwt-auth.guard';
import { RequirePermission } from 'src/core/decorator/require-permission.decorator';
import { PermissionsGuard } from 'src/core/guard/permissions.guard';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) { }

  @Post('admin')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async crearAdmin(@Body() dto: CrearAdminDto) {
    return this.usuarioService.crearAdmin(dto);
  }

  @Post('cobrador')
  @UseGuards(
    JwtAuthGuard,
    PermissionsGuard,
  )
  @RequirePermission('COBRADOR_CREAR')
  async crearCobrador(
    @Body() dto: CrearCobradorDto,
    @Req() req: Request
  ) {
    return this.usuarioService.crearCobrador(dto, req["user"]["id"]);
  }

  @Get('cobradores')
  @UseGuards(
    JwtAuthGuard,
    PermissionsGuard,
  )
  @RequirePermission('COBRADOR_VER')
  async obtenerCobradores(
    @Req() req: Request,
  ) {
    return this.usuarioService.obtenerPorRol(
      req["user"]["id"],
      'COBRADOR',
    );
  }

  @Get('cobrador/:id')
  @UseGuards(
    JwtAuthGuard,
    PermissionsGuard,
  )
  @RequirePermission('COBRADOR_VER')
  async detalleCobrador(
    @Req() req: Request,
    @Param("id") id: string
  ) {
    return this.usuarioService.obtenerPorId(
      id,
      req["user"]["id"],
    );
  }
}