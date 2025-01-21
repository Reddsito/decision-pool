import { Injectable, Logger } from '@nestjs/common';

import { createPollID, createUserID } from 'src/lib/utils';
import { CreatePollFields } from './interfaces/create-poll.interface';
import { JoinPollFields } from './interfaces/join-poll.interface';
import { RejoinPollFields } from './interfaces/re-join.poll.interface';
import { PollsRepository } from './polls.repository';

@Injectable()
export class PollsService {
  logger = new Logger(PollsService.name);
  constructor(private readonly pollsRepository: PollsRepository) {}

  async create(fields: CreatePollFields) {
    const pollID = createPollID();
    const userID = createUserID();

    const createdPoll = await this.pollsRepository.createPoll({
      pollID,
      ...fields,
      userID,
    });

    return {
      ...createdPoll,
      //access token
    };
  }

  async join(fields: JoinPollFields) {
    const userID = createUserID();

    this.logger.debug(
      `Fetching poll with ID: ${fields.pollID} for user with ID: ${userID}`,
    );

    const joinedPoll = await this.pollsRepository.getPoll(fields.pollID);

    // TODO - create access Token

    return {
      poll: joinedPoll,
      // accessToken: signedString,
    };
  }

  async rejoin(fields: RejoinPollFields) {
    this.logger.debug(
      `Rejoining poll with ID: ${fields.pollID} for user with ID: ${fields.userID} with name: ${fields.name}`,
    );

    const joinedPoll = await this.pollsRepository.addParticipant(fields);

    return joinedPoll;
  }
}
