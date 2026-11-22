import { defineRelations } from "drizzle-orm";
import * as schema from "./schema.js"


export const relations = defineRelations(schema, (r) => ({
    orders: {
        statusHistory: r.many.statusHistory(),
    },
    statusHistory: {
        order: r.one.orders({
            from: r.statusHistory.orderId,
            to: r.orders.id
        })
    }
}))