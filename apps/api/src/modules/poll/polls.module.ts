import { Module } from '@nestjs/common';
import { PollsController } from './polls.controller';
import { PollsService } from './polls.service';
import { redisModule } from '../redis/redis.config.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [PollsController],
  providers: [PollsService],
  imports: [redisModule, ConfigModule],
})
export class PollsModule {}
