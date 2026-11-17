import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller.js";
import { UsersModule } from "../users/users.module.js";
import { JwtAuth } from "./jwt-auth.provider.js";
import { CredentialsService } from "./credentials.service.js";
import { DrizzleRefreshTokenStore } from "./drizzle-refresh-token.store.js";


@Module({
    imports: [UsersModule],
    providers: [JwtAuth, CredentialsService, DrizzleRefreshTokenStore],
    controllers: [AuthController],
    exports: []
})

export class AuthModule {}