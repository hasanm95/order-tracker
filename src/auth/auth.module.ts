import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller.js";
import { UsersModule } from "../users/users.module.js";


@Module({
    imports: [UsersModule],
    providers: [],
    controllers: [AuthController],
    exports: []
})

export class AuthModule {}