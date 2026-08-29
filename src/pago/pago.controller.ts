import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { PagoService } from './pago.service';
import { CrearPagoDto } from './dto/create-pago.dto';
import { RequirePermission } from 'src/core/decorator/require-permission.decorator';
import { PermissionsGuard } from 'src/core/guard/permissions.guard';
import { JwtAuthGuard } from 'src/core/guard/jwt-auth.guard';
import { ReversarPagoDto } from './dto/reversar-pago-dto';

@Controller('pago')
export class PagoController {
  constructor(private readonly pagoService: PagoService) { }



  @Post()
  @UseGuards(
    JwtAuthGuard,
    PermissionsGuard,
  )
  @RequirePermission('PAGO_CREAR')
  registrarPago(
    @Body() dto: CrearPagoDto,
    @Req() req: Request,
  ) {
    return this.pagoService.registrarPago(
      dto,
      req["user"]["id"]

    );
  }

  @Patch(':id/reversar')
  @UseGuards(
    JwtAuthGuard,
    PermissionsGuard,
  )
  @RequirePermission('PAGO_CREAR')
  async reversarPago(
    @Param('id') id: string,
    @Body() dto: ReversarPagoDto,
    @Req() req: Request,
  ) {
    return this.pagoService.reversarPago(id, dto, req["user"]["id"]);
  }

  @Get(":id")
  @UseGuards(
    JwtAuthGuard,
    PermissionsGuard,
  )
  @RequirePermission('PAGO_VER')
  lista(
    @Param('id') id: string,

  ) {

    return this.pagoService.listarPagos(id);

  }
}
