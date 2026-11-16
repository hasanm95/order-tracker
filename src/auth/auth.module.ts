import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";


@Module({
    imports: [],
    providers: [AuthService],
    controllers: [AuthController],
    exports: []
})

export class AuthModule {}