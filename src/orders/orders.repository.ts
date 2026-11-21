import { Injectable } from "@nestjs/common";
import { Order, orders } from "../db/schema.js";
import { InjectDrizzle } from "@nestjs/drizzle";
import { NodePgDatabase } from "drizzle-orm/node-postgres";


@Injectable()
export class OrdersRepository {
    constructor(@InjectDrizzle() private readonly db: NodePgDatabase){}

    async create(data: Order) {
        const [row] = await this.db
                .insert(orders)
                .values(data)
                .returning({id: orders.id, tracking_code: orders.trackingCode, customer_name: orders.customerName, customer_phone: orders.customerPhone, items: orders.items, amount: orders.amount, created_at: orders.createdAt})

        return row
    }
}