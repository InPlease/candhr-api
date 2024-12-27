import { Test, TestingModule } from '@nestjs/testing';
import { TursoService } from '@/services/turso.service';

describe('TursoService', () => {
  let service: TursoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TursoService],
    }).compile();

    service = module.get<TursoService>(TursoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
