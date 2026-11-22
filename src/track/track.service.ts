import { Injectable } from '@nestjs/common';
import { TrackRepository } from './track.repository.js';

@Injectable()
export class TrackService {
    constructor(private readonly trackRepository: TrackRepository){}

    async getOrderTracking(code: string) {
        return this.trackRepository.getOrderTracking(code)
    }
}
