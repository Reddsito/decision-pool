import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { IORedisKey } from '../redis/redis.module';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { CreatePollData, Poll } from './types/poll.types';
import {
  AddParticipantData,
  AddParticipantRankingsData,
  RemoveParticipantData,
} from './types/participant.types';
import { AddNominationData } from './types/nominations.types';
import { Results } from './types/result.types';

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
      nominations: {},
      rankings: {},
      adminID: userID,
      hasStarted: false,
      hasFinished: false,
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
      throw new InternalServerErrorException(`Failed to add poll ${pollID}`);
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

  async removeParticipant({
    pollID,
    userID,
  }: RemoveParticipantData): Promise<Poll> {
    this.logger.log(`removing userID: ${userID} from poll: ${pollID}`);

    const key = `polls:${pollID}`;
    const participantPath = `.participants.${userID}`;

    try {
      await this.deleteJson(key, participantPath);

      return this.getPoll(pollID);
    } catch (e) {
      this.logger.error(
        `Failed to remove userID: ${userID} from poll: ${pollID}`,
        e,
      );
      throw e;
    }
  }

  async addNomination({
    pollID,
    nominationID,
    nomination,
  }: AddNominationData): Promise<Poll> {
    this.logger.log(
      `Adding nomination with nominationID: ${nominationID} to pollID: ${pollID}`,
    );

    const key = `polls:${pollID}`;
    const nominationPath = `.nominations.${nominationID}`;

    try {
      await this.setJSONWithExpire(
        key,
        nomination,
        parseInt(this.ttl),
        nominationPath,
      );

      return this.getPoll(pollID);
    } catch (e) {
      this.logger.error(
        `Failed to add nomination with nominationID: ${nominationID} to pollID: ${pollID}`,
      );
      throw e;
    }
  }

  async removeNomination(pollID: string, nominationID: string): Promise<Poll> {
    this.logger.log(
      `Removing nomination with nominationID: ${nominationID} from pollID: ${pollID}`,
    );

    const key = `polls:${pollID}`;
    const nominationPath = `.nominations.${nominationID}`;

    try {
      await this.deleteJson(key, nominationPath);

      return this.getPoll(pollID);
    } catch (e) {
      this.logger.error(
        `Failed to remove nomination with nominationID: ${nominationID} from pollID: ${pollID}`,
      );
      throw new InternalServerErrorException('Failed to remove nomination');
    }
  }

  async startPoll(pollID: string): Promise<Poll> {
    this.logger.log(`Starting poll with pollID: ${pollID}`);

    const key = `polls:${pollID}`;

    try {
      const currentPoll = await this.getPoll(pollID);

      if (currentPoll.hasStarted) {
        throw new ConflictException('Poll has already started');
      }

      await this.setJSONWithExpire(
        key,
        true,
        parseInt(this.ttl),
        '.hasStarted',
      );

      return this.getPoll(pollID);
    } catch (e) {
      this.logger.error(`Failed to start poll with pollID: ${pollID}`);
      throw e;
    }
  }

  async addParticipantRankings({
    pollID,
    userID,
    rankings,
  }: AddParticipantRankingsData): Promise<Poll> {
    this.logger.log(
      `Attempting to add rankings for userID/name: ${userID} to pollID: ${pollID}`,
      rankings,
    );

    const key = `polls:${pollID}`;
    const rankingsPath = `.rankings.${userID}`;

    try {
      await this.setJSONWithExpire(
        key,
        rankings,
        parseInt(this.ttl),
        rankingsPath,
      );

      return this.getPoll(pollID);
    } catch (e) {
      this.logger.error(
        `Failed to add a rankings for userID/name: ${userID}/ to pollID: ${pollID}`,
        rankings,
      );
      throw new InternalServerErrorException(
        'There was an error starting the poll',
      );
    }
  }

  async addResults(pollID: string, results: Results): Promise<Poll> {
    this.logger.log(`Adding results to poll with ID: ${pollID}`);

    const key = `polls:${pollID}`;
    const resultsPath = '.results';

    try {
      await this.setJSONWithExpire(
        key,
        results,
        parseInt(this.ttl),
        resultsPath,
      );

      await this.setJSONWithExpire(
        key,
        true,
        parseInt(this.ttl),
        '.hasFinished',
      );

      return this.getPoll(pollID);
    } catch (e) {
      this.logger.error(`Failed to add results to poll with ID: ${pollID}`);
      throw e;
    }
  }

  async deletePoll(pollID: string): Promise<void> {
    this.logger.log(`Deleting poll with ID: ${pollID}`);

    const key = `polls:${pollID}`;

    try {
      await this.deleteJson(key);
    } catch (e) {
      this.logger.error(`Failed to delete poll with ID: ${pollID}`);
      throw e;
    }
  }

  private setJSONWithExpire(
    key: string,
    value: object | boolean,
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

  private deleteJson(key: string, path: string = '.') {
    const object = this.redisClient.call('JSON.DEL', [key, path]);
    return object;
  }
}
