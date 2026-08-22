import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PermisoService } from './permiso.service';
import { CreatePermisoDto } from './dto/create-permiso.dto';
import { UpdatePermisoDto } from './dto/update-permiso.dto';

@Controller('permiso')
export class PermisoController {
  constructor(private readonly permisoService: PermisoService) {}

}
