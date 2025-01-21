import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { IORedisKey } from '../redis/redis.module';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { CreatePollData } from './types/create-poll.type';
import { Poll } from './types/poll.type';

@Injectable()
export class PollsRepository {
  private readonly ttl: string;
  private readonly logger = new Logger(PollsRepository.name);

  constructor(
    @Inject(IORedisKey) private readonly redisClient: Redis,
    configService: ConfigService,
  ) {
    this.ttl = configService.get<string>('redis.ttl');
  }

  async createPoll({
    pollID,
    topic,
    votesPerVoter,
    userId,
  }: CreatePollData): Promise<Poll> {
    const initialPoll: Poll = {
      topic,
      id: pollID,
      votesPerVoter,
      participants: {},
      adminID: userId,
    };

    this.logger.log(
      `Creating new poll: ${JSON.stringify(initialPoll, null, 2)} with TTL ${
        this.ttl
      }`,
    );

    const key = `polls:${pollID}`;

    try {
      await this.setJSONWithExpire(key, initialPoll, parseInt(this.ttl));
      return initialPoll;
    } catch (e) {
      this.logger.error(
        `Failed to add poll ${JSON.stringify(initialPoll)}\n${e}`,
      );
      throw new InternalServerErrorException();
    }
  }

  async getPoll(pollID: string): Promise<Poll> {
    this.logger.log(`Attempting to get poll with: ${pollID}`);

    const key = `polls:${pollID}`;

    try {
      const currentPoll = await this.getJSON(key);
      this.logger.verbose(currentPoll);

      // if (currentPoll?.hasStarted) {
      //   throw new BadRequestException('The poll has already started');
      // }

      return JSON.parse(currentPoll);
    } catch (e) {
      this.logger.error(`Failed to get pollID ${pollID}`);
      throw e;
    }
  }

  private setJSONWithExpire(key: string, value: object, ttl: number = 3600) {
    const jsonString = JSON.stringify(value);

    const object = this.redisClient
      .multi()
      .set(key, jsonString)
      .expire(key, ttl)
      .exec();

    return object;
  }

  private getJSON(key: string) {
    const object = this.redisClient.get(key);
    return object;
  }
}
