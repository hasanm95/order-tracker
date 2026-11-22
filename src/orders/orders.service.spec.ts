import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service.js';
import { OrdersRepository } from './orders.repository.js';

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: OrdersRepository,
          useValue: {
            create: vi.fn(),
            getOrderStatus: vi.fn(),
            updateOrderStatus: vi.fn()
          }
        }
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it("should generates a unique tracking code each time", () => {
    const a = service.generateTrackingCode();
    const b = service.generateTrackingCode();
    expect(a).not.toBe(b);
    expect(a.length).toBeGreaterThan(0);
  })
});
