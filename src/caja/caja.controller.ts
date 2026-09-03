import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { CajaService } from './caja.service';
import { JwtAuthGuard } from 'src/core/guard/jwt-auth.guard';
import { PermissionsGuard } from 'src/core/guard/permissions.guard';
import { RequirePermission } from 'src/core/decorator/require-permission.decorator';
import { CreateCajaDto } from './dto/create-caja.dto';


@Controller('caja')
export class CajaController {
  constructor(
    private readonly cajaService: CajaService,
  ) {}

  @Post()
  @UseGuards(
    JwtAuthGuard,
    PermissionsGuard,
  )
  @RequirePermission('CAJA_APERTURA')
  crear(
    @Body() dto: CreateCajaDto,
    @Req() req: Request,
  ) {
    return this.cajaService.crearCaja(
      dto,
      req['user']['id'],
    );
  }
}