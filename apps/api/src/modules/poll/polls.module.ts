import { Module } from '@nestjs/common';
import { PollsController } from './polls.controller';
import { PollsService } from './polls.service';
import { redisModule } from '../../config/modules.config';
import { ConfigModule } from '@nestjs/config';
import { PollsRepository } from './polls.repository';
import { AuthModule } from '../auth/auth.module';
import { PollsGateway } from './polls.gateway';

@Module({
  controllers: [PollsController],
  providers: [PollsService, PollsRepository, PollsGateway],
  imports: [redisModule, ConfigModule, AuthModule],
})
export class PollsModule {}
