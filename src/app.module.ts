import { Module } from '@nestjs/common';
import { AuthenticationModule } from '@nestjs/authentication';
import { DrizzleModule } from '@nestjs/drizzle';
import { drizzle } from 'drizzle-orm/node-postgres';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module.js';
import { RedisModule } from './redis/redis.module.js';
import { OrdersModule } from './orders/orders.module.js';
import { relations } from "./db/relations.js"
import { TrackModule } from './track/track.module.js';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [{ttl: 60000, limit: 10 }]
    }),
    AuthenticationModule.forRootAsync({
      useFactory: () => ({
        accessToken: {
          key: process.env.JWT_ACCESS_SECRET!,
          issuer: "http://localhost:3000",
          audience: "my-app",
          ttl: "15m"
        },
        refreshToken: {
          ttl: "30d",
          absoluteTtl: "90d"
        }
      })
    }),
    AuthModule,
    DrizzleModule.forRoot({
      drizzle,
      connection: process.env.DATABASE_URL!,
      relations
    }),
    RedisModule,
    OrdersModule,
    TrackModule
  ],
  controllers: [],
  providers: [{provide: APP_GUARD, useClass: ThrottlerGuard}],
})
export class AppModule {}
