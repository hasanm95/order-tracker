import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { TrackService } from './track.service.js';
import { Public } from '@nestjs/authentication';

@Controller({
    path: "track",
    version: "1"
})
export class TrackController {
    constructor(private readonly trackService: TrackService){}

    @Public()
    @Get(":code")
    async getCurrentStatus(@Param("code") code: string){
        return await this.trackService.getOrderTracking(code)
    }
}
