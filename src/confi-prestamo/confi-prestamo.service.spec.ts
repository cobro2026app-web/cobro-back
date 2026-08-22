import { Test, TestingModule } from '@nestjs/testing';
import { ConfiPrestamoService } from './confi-prestamo.service';

describe('ConfiPrestamoService', () => {
  let service: ConfiPrestamoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfiPrestamoService],
    }).compile();

    service = module.get<ConfiPrestamoService>(ConfiPrestamoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
