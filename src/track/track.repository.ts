import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectDrizzle } from "@nestjs/drizzle";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { orders, OrderStatus, statusHistory } from "../db/schema.js";
import { asc, eq } from "drizzle-orm";

@Injectable()
export class TrackRepository{
    constructor(@InjectDrizzle() private readonly db: NodePgDatabase){}

    async getOrderTracking(code: string) {
        const [order] = await this.db
            .select({
                id: orders.id
            })
            .from(orders)
            .where(eq(orders.trackingCode, code))
            .limit(1)

        if (!order) {
            throw new NotFoundException("Order not found")
        }

        const timeline = await this.db
            .select({
                status: statusHistory.status,
                changedAt: statusHistory.changedAt
            })
            .from(statusHistory)
            .where(eq(statusHistory.orderId, order.id))
            .orderBy(asc(statusHistory.changedAt))

        const currentStatus = timeline.length > 0 ? timeline[timeline.length - 1].status : OrderStatus.PLACED

        return {
            trackingCode: code,
            currentStatus,
            timeline,
        }
    }
}