import { Test, TestingModule } from '@nestjs/testing';
import { TrackService } from './track.service.js';
import { TrackRepository } from './track.repository.js';

describe('TrackService', () => {
  let service: TrackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrackService,
        {
          provide: TrackRepository,
          useValue: {
            getOrderTracking: vi.fn()
          }
        }
      ],
    }).compile();

    service = module.get<TrackService>(TrackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
