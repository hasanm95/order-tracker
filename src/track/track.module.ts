import { Module } from '@nestjs/common';
import { TrackController } from './track.controller.js';
import { TrackService } from './track.service.js';

@Module({
  controllers: [TrackController],
  providers: [TrackService]
})
export class TrackModule {}
