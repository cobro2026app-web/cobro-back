import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';

import { CredencialService } from './credencial.service';
import { LoginDto } from './dto/login.dto';

@Controller('credencial')
export class CredencialController {
  constructor(
    private readonly credencialService: CredencialService,
  ) { }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
  ) {
    return this.credencialService.login(dto);
  }
}