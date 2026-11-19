import { Module } from '@nestjs/common';
import { AuthenticationModule } from '@nestjs/authentication';
import { DrizzleModule } from '@nestjs/drizzle';
import { drizzle } from 'drizzle-orm/node-postgres';
import { AuthModule } from './auth/auth.module.js';
import { RedisModule } from './redis/redis.module.js';
import { OrdersModule } from './orders/orders.module.js';

@Module({
  imports: [
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
    }),
    RedisModule,
    OrdersModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
