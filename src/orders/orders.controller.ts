import { Body, Controller, Post } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { Public } from '@nestjs/authentication';
import { OrdersService } from './orders.service.js';

@Controller({
    path: "orders",
    version: "1",
})
export class OrdersController {
    constructor(private readonly ordersService: OrdersService){}

    @Public()
    @Post("/")
    async createOrder(@Body() dto: CreateOrderDto){
        const createdOrder = await this.ordersService.createOrder({
            customerName: dto.customer_name,
            customerPhone: dto.customer_phone,
            address: dto.address,
            items: dto.items,
            amount: dto.amount
        })
        return createdOrder
    }
}
