import { Controller, Get, MessageEvent, Param, Sse } from '@nestjs/common';
import { TrackService } from './track.service.js';
import { Public } from '@nestjs/authentication';
import { interval, map, merge, Observable } from 'rxjs';
import { RedisPubSubService } from '../redis/redis-pubsub.service.js';

@Controller({
    path: "track",
    version: "1"
})
export class TrackController {
    constructor(
        private readonly trackService: TrackService,
        private readonly redisPubSub: RedisPubSubService,
    ){}

    @Public()
    @Get(":code")
    async getCurrentStatus(@Param("code") code: string){
        return await this.trackService.getOrderTracking(code)
    }

    @Public()
    @Sse(":code/stream")
    async streamTracking(@Param('code') code: string): Promise<Observable<MessageEvent>>{
        // Verify the tracking code exists first (returns 404 if invalid)
        await this.trackService.getOrderTracking(code);

        // Stream matching status updates from redis
        const updates$ = this.redisPubSub.subscribeToOrder(code).pipe(
            map(
                (payload): MessageEvent => ({
                    type: 'status_update',
                    data: payload,
                })
            )
        )

        // Send a ping every 25s so AWS ALB (60s idle timeout) doesn't close the connection
        const heartbeat$ = interval(25000).pipe(
            map(
                (): MessageEvent => ({
                    type: 'ping',
                    data: { ts: Date.now() },
                }),
            ),
        );

        return merge(updates$, heartbeat$)
    }
}
