import crypto from "node:crypto"
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OrdersRepository } from './orders.repository.js';
import { CreateOrder } from "./orders.types.js";
import { OrderStatus } from "../db/schema.js";

const ALLOWED_TRANSITIONS: Partial<Record<OrderStatus, OrderStatus>> = {
    [OrderStatus.PLACED]: OrderStatus.PACKED,
    [OrderStatus.PACKED]: OrderStatus.ON_THE_WAY,
    [OrderStatus.ON_THE_WAY]: OrderStatus.DELIVERED,
}

const TERMINCAL_STATES = new Set<OrderStatus>([
    OrderStatus.DELIVERED,
    OrderStatus.CANCELLED
])

@Injectable()
export class OrdersService {
    constructor(private readonly ordersRepository: OrdersRepository){}

    async createOrder(data: Omit<CreateOrder, "trackingCode">) {
        const trackingCode = this.generateTrackingCode()
        const order = await this.ordersRepository.create({
            ...data,
            trackingCode,
        })
        return order
    }

    async updateOrderStatus(id: string, changed_by: string){
        const order = await this.ordersRepository.getOrderStatus(id)
        
        if (!order) {
            throw new NotFoundException(`Order ${id} not found`)
        }

        const currentStatus = order.status ?? "Placed"
        const allowedNext = ALLOWED_TRANSITIONS[currentStatus]
        if (!allowedNext) {
            throw new BadRequestException(`Cannot transition order from "${currentStatus}"`)
        }

        const updatedStaus = await this.ordersRepository.updateOrderStatus(id, allowedNext, changed_by)
        return updatedStaus
    }

    async cancelOrder(id: string, changed_by: string) {
        const order = await this.ordersRepository.getOrderStatus(id)
        
        if (!order) {
            throw new NotFoundException(`Order ${id} not found`)
        }

        const currentStatus = order.status ?? OrderStatus.PLACED
        if (TERMINCAL_STATES.has(currentStatus)) {
            throw new BadRequestException(`Order already ${currentStatus}`)
        }

        const updatedStaus = await this.ordersRepository.updateOrderStatus(id, OrderStatus.CANCELLED, changed_by)
        return updatedStaus
    }

    generateTrackingCode(){
        return crypto.randomBytes(16).toString("base64url")
    }
}
