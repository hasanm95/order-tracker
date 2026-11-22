import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { filter, Observable, Subject, map  } from "rxjs";
import { Redis } from 'ioredis';
import { REDIS_CLIENT, REDIS_SUBSCRIBER } from "./redis.constants.js";

export interface OrderStatusEvent {
  trackingCode: string; 
  status: string;     
  changedAt: string;  
}

@Injectable()
export class RedisPubSubService implements OnModuleInit {
    private readonly logger = new Logger(RedisPubSubService.name)

    private readonly events$ = new Subject<{
        channel: string;
        payload: OrderStatusEvent
    }>();

    constructor(
        @Inject(REDIS_CLIENT) private readonly publisher: Redis,
        @Inject(REDIS_SUBSCRIBER) private readonly subscriber: Redis
    ){}

    async onModuleInit() {
        await this.subscriber.psubscribe("order:track:*")

        this.subscriber.on("pmessage", (_pattern, channel, rawMessage) => {
            try {
                const payload = JSON.parse(rawMessage) as OrderStatusEvent

                this.events$.next({channel, payload})
            } catch (err) {
                this.logger.error(`Failed to parse Redis message on ${channel}`, err);
            }
        })
    }

    async publishOrderStatus(event: OrderStatusEvent): Promise<void> {
        try {
            const channel = `order:track:${event.trackingCode}`
            await this.publisher.publish(channel, JSON.stringify(event))          
        } catch (err) {
            this.logger.warn(`Redis publish failed for ${event.trackingCode} (DB already updated)`, err); 
        }
    }

    subscribeToOrder(trackingCode: string): Observable<OrderStatusEvent> {
        const targetChannel = `order:track:${trackingCode}`;
        return this.events$.asObservable().pipe(
            filter((event) => event.channel === targetChannel),
            map((event) => event.payload),
        );
    }
}