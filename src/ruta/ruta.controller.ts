import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { RutaService } from './ruta.service';
import { CrearRutaDto } from './dto/create-ruta.dto';
import { JwtAuthGuard } from 'src/core/guard/jwt-auth.guard';
import { PermissionsGuard } from 'src/core/guard/permissions.guard';
import { RequirePermission } from 'src/core/decorator/require-permission.decorator';

@Controller('ruta')
export class RutaController {
  constructor(private readonly rutaService: RutaService) { }

  @Post()
  @UseGuards(
    JwtAuthGuard,
    PermissionsGuard,
  )
  @RequirePermission('RUTA_CREAR')
  create(@Body() createRutaDto: CrearRutaDto,
    @Req() req: Request
  ) {
    return this.rutaService.crear(createRutaDto, req["user"]["id"]);
  }

  @Get()
  @UseGuards(
    JwtAuthGuard,
    PermissionsGuard,
  )
  @RequirePermission('RUTA_VER')
  listar(
    @Req() req: Request
  ) {
    return this.rutaService.listar(req["user"]["id"]);
  }


}
