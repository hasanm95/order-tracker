import { Module } from '@nestjs/common';
import { TrackController } from './track.controller.js';
import { TrackService } from './track.service.js';
import { TrackRepository } from './track.repository.js';

@Module({
  controllers: [TrackController],
  providers: [TrackService, TrackRepository]
})
export class TrackModule {}
