import { Test, TestingModule } from '@nestjs/testing';
import { ConfiPrestamoController } from './confi-prestamo.controller';
import { ConfiPrestamoService } from './confi-prestamo.service';

describe('ConfiPrestamoController', () => {
  let controller: ConfiPrestamoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConfiPrestamoController],
      providers: [ConfiPrestamoService],
    }).compile();

    controller = module.get<ConfiPrestamoController>(ConfiPrestamoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
