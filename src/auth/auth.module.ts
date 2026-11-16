import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller.js";


@Module({
    imports: [],
    providers: [],
    controllers: [AuthController],
    exports: []
})

export class AuthModule {}