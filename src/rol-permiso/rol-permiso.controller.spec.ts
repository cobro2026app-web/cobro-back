import { Test, TestingModule } from '@nestjs/testing';
import { RolPermisoController } from './rol-permiso.controller';
import { RolPermisoService } from './rol-permiso.service';

describe('RolPermisoController', () => {
  let controller: RolPermisoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolPermisoController],
      providers: [RolPermisoService],
    }).compile();

    controller = module.get<RolPermisoController>(RolPermisoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
