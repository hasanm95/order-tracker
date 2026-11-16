import { Injectable } from "@nestjs/common";
import { SignUpDto } from "./auth.dto.js";


@Injectable()
export class AuthService {
    private JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET

    async signUp(dto: SignUpDto) {

    }
}