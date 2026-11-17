import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module.js';
import { AuthenticationModule } from '@nestjs/authentication';

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
      })
    }),
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
