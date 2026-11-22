import crypto from "node:crypto"
import { Injectable } from '@nestjs/common';
import { OrdersRepository } from './orders.repository.js';
import { CreateOrder } from "./orders.types.js";

@Injectable()
export class OrdersService {
    constructor(private readonly ordersRepository: OrdersRepository){}

    async createOrder(data: Omit<CreateOrder, "trackingCode">) {
        const trackingCode = this.generateTrackingCode()
        const order = await this.ordersRepository.create({
            ...data,
            trackingCode,
        })
        console.log({order})
        return order
    }

    generateTrackingCode(){
        return crypto.randomBytes(16).toString("base64url")
    }
}
