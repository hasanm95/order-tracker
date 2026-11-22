import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller.js";
import { UsersModule } from "../users/users.module.js";
import { JwtAuth } from "./jwt-auth.provider.js";
import { CredentialsService } from "./credentials.service.js";


@Module({
    imports: [UsersModule],
    providers: [JwtAuth, CredentialsService],
    controllers: [AuthController],
    exports: []
})

export class AuthModule {}