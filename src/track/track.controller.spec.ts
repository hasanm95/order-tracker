import { Test, TestingModule } from '@nestjs/testing';
import { TrackController } from './track.controller.js';
import { TrackService } from './track.service.js';
import { RedisPubSubService } from '../redis/redis-pubsub.service.js';

describe('TrackController', () => {
  let controller: TrackController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrackController],
      providers: [
        { provide: TrackService, useValue: { getOrderTracking: vi.fn() } },
        { provide: RedisPubSubService, useValue: { subscribeToOrder: vi.fn() } },
      ],
    }).compile();

    controller = module.get<TrackController>(TrackController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
