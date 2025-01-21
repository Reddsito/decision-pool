import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { PollsService } from './polls.service';
import { CreatePollDto } from './dtos/create-poll.dto';
import { JoinPollDto } from './dtos/join-poll.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetPayload } from '../auth/decorators/get-payload';
import { AuthPayload } from '../auth/interfaces/auth-payload.interface';

@Controller('polls')
export class PollsController {
  logger = new Logger(PollsController.name);
  constructor(private readonly pollsService: PollsService) {}

  @UseGuards()
  @Post()
  async create(@Body() createPollDto: CreatePollDto) {
    Logger.log('In create!');
    const result = await this.pollsService.create(createPollDto);
    return result;
  }

  @Post('/join')
  async join(@Body() joinPollDto: JoinPollDto) {
    Logger.log('In join!');
    const result = this.pollsService.join(joinPollDto);
    return result;
  }

  @UseGuards(AuthGuard())
  @Post('/rejoin')
  async rejoin(@GetPayload() payload: AuthPayload) {
    Logger.log('In rejoin!');
    const result = await this.pollsService.rejoin(payload);
    return result;
  }
}
