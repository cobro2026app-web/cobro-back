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


import { ClienteService } from './cliente.service';

import { CrearClienteDto } from './dto/crear-cliente.dto';

import { JwtAuthGuard } from 'src/core/guard/jwt-auth.guard';

import { PermissionsGuard } from 'src/core/guard/permissions.guard';

import { RequirePermission } from 'src/core/decorator/require-permission.decorator';

@Controller('cliente')
export class ClienteController {

  constructor(
    private readonly clienteService:
      ClienteService,
  ) { }

  @Post()
  @UseGuards(
    JwtAuthGuard,
    PermissionsGuard,
  )
  @RequirePermission('CLIENTE_CREAR')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  async crear(
    @Body() dto: CrearClienteDto,
    @Req() req: Request
  ) {
    return this.clienteService.crear(dto, req["user"]["id"]);
  }

  @Get()
  @UseGuards(
    JwtAuthGuard,
    PermissionsGuard,
  )
  @RequirePermission('CLIENTE_VER')
  async listar(
    @Req() req: Request,
  ) {
    return this.clienteService.listar(
      req["user"]["id"],
    );
  }
  @Get(":id")
  @UseGuards(
    JwtAuthGuard,
    PermissionsGuard,
  )
  @RequirePermission('CLIENTE_VER')
  async clienteId(
    @Param("id") id: string,
  ) {
    return this.clienteService.clienteById(
      id
    );
  }
}