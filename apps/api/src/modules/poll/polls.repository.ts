import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { IORedisKey } from '../redis/redis.module';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { CreatePollData } from './types/create-poll.type';
import { Poll } from './types/poll.type';
import { AddParticipantData } from './types/add-participant.type';

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
    userID,
  }: CreatePollData): Promise<Poll> {
    const initialPoll: Poll = {
      topic,
      id: pollID,
      votesPerVoter,
      participants: {},
      adminID: userID,
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

      if (currentPoll === null) {
        throw new NotFoundException('Poll does not exist');
      }

      // if (currentPoll?.hasStarted) {
      //   throw new BadRequestException('The poll has already started');
      // }

      return JSON.parse(currentPoll as string);
    } catch (e) {
      this.logger.error(`Failed to get pollID ${pollID}`);
      throw e;
    }
  }

  async addParticipant({
    pollID,
    userID,
    name,
  }: AddParticipantData): Promise<Poll> {
    this.logger.log(
      `Attempting to add a participant with userID/name: ${userID}/${name} to pollID: ${pollID}`,
    );

    const key = `polls:${pollID}`;
    const participantPath = `.participants.${userID}`;

    try {
      const currentPoll = await this.getJSON(key);

      if (currentPoll === null) {
        throw new NotFoundException('Poll does not exist');
      }

      await this.setJSONWithExpire(
        key,
        { name },
        parseInt(this.ttl),
        participantPath,
      );

      const updatedPoll = await this.getJSON(key);

      const poll = JSON.parse(updatedPoll as string) as Poll;

      this.logger.debug(
        `Current Participants for pollID: ${pollID}:`,
        poll.participants,
      );

      return poll;
    } catch (e) {
      this.logger.error(
        `Failed to add a participant with userID/name: ${userID}/${name} to pollID: ${pollID}`,
      );
      throw e;
    }
  }

  private setJSONWithExpire(
    key: string,
    value: object,
    ttl: number,
    path: string = '.',
  ) {
    const jsonString = JSON.stringify(value);

    const object = this.redisClient
      .multi([
        ['send_command', 'JSON.SET', key, path, jsonString],
        ['expire', key, ttl],
      ])
      .exec();

    return object;
  }

  private getJSON(key: string) {
    const object = this.redisClient.call('JSON.GET', [key]);
    return object;
  }
}
