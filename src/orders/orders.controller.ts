import { Body, Controller, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { CreateOrderDto } from './dto/order.dto.js';
import { CurrentUser } from '@nestjs/authentication';
import { OrdersService } from './orders.service.js';
import type { User } from '../db/schema.js';

@Controller({
    path: "orders",
    version: "1",
})
export class OrdersController {
    constructor(private readonly ordersService: OrdersService){}

    @Post("/")
    async createOrder(@CurrentUser() user: User, @Body() dto: CreateOrderDto){
        const createdOrder = await this.ordersService.createOrder({
            customerName: dto.customer_name,
            customerPhone: dto.customer_phone,
            address: dto.address,
            items: dto.items,
            amount: dto.amount,
            createdBy: user.email
        })
        return createdOrder
    }

    @Patch(":id/status")
    async updateStatus(
        @CurrentUser() user: User, 
        @Param("id", ParseUUIDPipe) id: string, 
    ){
        return this.ordersService.updateOrderStatus(id, user.email)
    }
}
