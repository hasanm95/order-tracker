import { Global, Inject, Module, OnApplicationShutdown } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisPubSubService } from './redis-pubsub.service.js';
import { REDIS_CLIENT, REDIS_SUBSCRIBER } from './redis.constants.js';

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
    },
    RedisPubSubService
  ],
  exports: [REDIS_CLIENT, REDIS_SUBSCRIBER, RedisPubSubService],
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

export { REDIS_CLIENT, REDIS_SUBSCRIBER };
