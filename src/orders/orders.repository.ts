import { Injectable } from "@nestjs/common";
import { orders, statusHistory } from "../db/schema.js";
import { InjectDrizzle } from "@nestjs/drizzle";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { CreateOrder } from "./orders.types.js";

@Injectable()
export class OrdersRepository {
    constructor(@InjectDrizzle() private readonly db: NodePgDatabase){}

    async create(data: CreateOrder) {
        return await this.db.transaction(async (tx) => {
            // Insert new order
            const [newOrder] = await tx
                .insert(orders)
                .values({
                    trackingCode: data.trackingCode, 
                    customerName: data.customerName, 
                    customerPhone: data.customerPhone, 
                    items: data.items, 
                    address: data.address, 
                    amount: data.amount
                })
                .returning()
            
            // Insert initial 'Placed' status history record
            await tx.insert(statusHistory).values({
                orderId: newOrder.id,
                status: 'Placed',
                changedBy: data.createdBy,
            })

            return newOrder
        })
    }
}