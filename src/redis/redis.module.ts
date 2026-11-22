import { Global, Inject, Module, OnApplicationShutdown } from '@nestjs/common';
import { Redis } from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';
export const REDIS_SUBSCRIBER = 'REDIS_SUBSCRIBER';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: () => {
        const [host, port] = (process.env.REDIS_ADDR || 'redis:6379').split(':');
        return new Redis({
          host,
          port: Number(port),
          password: process.env.REDIS_PASS,
        });
      },
    },
    {
      provide: REDIS_SUBSCRIBER,
      useFactory: (redisClient: Redis) => redisClient.duplicate(),
      inject: [REDIS_CLIENT]
    }
  ],
  exports: [REDIS_CLIENT, REDIS_SUBSCRIBER],
})
export class RedisModule implements OnApplicationShutdown {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    @Inject(REDIS_SUBSCRIBER) private readonly subscriber: Redis
  ) {}

  async onApplicationShutdown() {
    await Promise.all([this.redis.quit(), this.subscriber.quit()])
  }
}
