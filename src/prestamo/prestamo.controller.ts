import {
  Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards,
} from '@nestjs/common';
import { PrestamoService } from './prestamo.service';
import { CrearPrestamoDto } from './dto/create-prestamo.dto';
import { PermissionsGuard } from 'src/core/guard/permissions.guard';
import { JwtAuthGuard } from 'src/core/guard/jwt-auth.guard';
import { RequirePermission } from 'src/core/decorator/require-permission.decorator';

@Controller('prestamo')
export class PrestamoController {
  constructor(private readonly prestamoService: PrestamoService) { }

  @Post()
  @Post()
  @UseGuards(
    JwtAuthGuard,
    PermissionsGuard,
  )
  @RequirePermission('CLIENTE_CREAR')
  create(@Body() createPrestamoDto: CrearPrestamoDto,
    @Req() req: Request
  ) {
    return this.prestamoService.crearPrestamo(createPrestamoDto,
      req["user"]["id"],

    );
  }

  @Get()
  @UseGuards(
    JwtAuthGuard,
    PermissionsGuard,
  )
  @RequirePermission('PRESTAMO_VER')
  listar(@Req() req: Request
  ) {
    return this.prestamoService.listarPrestamos(
      req["user"]["id"],

    );
  }








}
