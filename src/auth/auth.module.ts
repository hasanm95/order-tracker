import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import { UsersModule } from "../users/users.module.js";


@Module({
    imports: [UsersModule],
    providers: [AuthService],
    controllers: [AuthController],
    exports: []
})

export class AuthModule {}