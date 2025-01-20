import { Body, Controller, Logger, Post } from '@nestjs/common';
import { PollsService } from './polls.service';
import { CreatePollDto } from './dtos/create-poll.dto';
import { JoinPollDto } from './dtos/join-poll.dto';
import { ReJoinPollDto } from './dtos/re-join-poll.dto';

@Controller('polls')
export class PollsController {
  logger = new Logger(PollsController.name);
  constructor(private readonly pollsService: PollsService) {}

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

  @Post('/rejoin')
  async rejoin(@Body() rejoinPollDto: ReJoinPollDto) {
    Logger.log('In rejoin!');
    const result = await this.pollsService.rejoin(rejoinPollDto);
    return result;
  }
}
