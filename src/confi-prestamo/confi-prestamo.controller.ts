import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards, Req } from '@nestjs/common';
import { ConfiPrestamoService } from './confi-prestamo.service';
import { JwtAuthGuard } from 'src/core/guard/jwt-auth.guard';
import { PermissionsGuard } from 'src/core/guard/permissions.guard';
import { RequirePermission } from 'src/core/decorator/require-permission.decorator';
import { ConfiguracionDto } from './dto/configuracion.dto';

@Controller('confi-prestamo')
export class ConfiPrestamoController {
  constructor(private readonly confiPrestamoService: ConfiPrestamoService) { }


  @Post('prestamos')
  @UseGuards(
    JwtAuthGuard,
    PermissionsGuard,
  )
  @RequirePermission('CONFIG_PRESTAMO_CREAR')
  async guardarConfiguracion(
    @Body() dto: ConfiguracionDto,
    @Req() req: Request,
  ) {


    return this.confiPrestamoService
      .guardarConfiguracion(
        dto,
        req["user"]["id"],
      );
  }

  @Get('prestamos')
  @UseGuards(
    JwtAuthGuard,
    PermissionsGuard,
  )
  @RequirePermission('CONFIGURACION_VER')
  async obtenerConfiguracion(
    @Req() req: Request,
  ) {
    return this.confiPrestamoService
      .obtenerConfiguracion(
        req["user"]["id"],
      );
  }
}
