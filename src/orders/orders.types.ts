import { Order } from "../db/schema.js";

export interface CreateOrder extends Order {
    createdBy: string
}