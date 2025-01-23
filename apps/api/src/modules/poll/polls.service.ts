import { Injectable, Logger } from '@nestjs/common';

import { createNominationID, createPollID, createUserID } from 'src/lib/utils';

import { PollsRepository } from './polls.repository';
import { JwtService } from '@nestjs/jwt';
import {
  CreatePollFields,
  JoinPollFields,
  Poll,
  RejoinPollFields,
} from './types/poll.types';
import {
  AddParticipantFields,
  RemoveParticipantFields,
} from './types/participant.types';
import { AddNominationFields } from './types/nominations.types';

@Injectable()
export class PollsService {
  logger = new Logger(PollsService.name);
  constructor(
    private readonly pollsRepository: PollsRepository,
    private readonly jwtService: JwtService,
  ) {}

  async create(fields: CreatePollFields) {
    const pollID = createPollID();
    const userID = createUserID();

    const createdPoll = await this.pollsRepository.createPoll({
      pollID,
      ...fields,
      userID,
    });

    const signedString = this.jwtService.sign(
      {
        pollID: createdPoll.id,
        name: fields.name,
      },
      {
        subject: userID,
      },
    );

    return {
      poll: createdPoll,
      accessToken: signedString,
    };
  }

  async join(fields: JoinPollFields) {
    const userID = createUserID();

    this.logger.debug(
      `Fetching poll with ID: ${fields.pollID} for user with ID: ${userID}`,
    );

    const joinedPoll = await this.pollsRepository.getPoll(fields.pollID);

    const signedString = this.jwtService.sign(
      {
        pollID: joinedPoll.id,
        name: fields.name,
      },
      {
        subject: userID,
      },
    );

    return {
      poll: joinedPoll,
      accessToken: signedString,
    };
  }

  async rejoin(fields: RejoinPollFields) {
    this.logger.debug(
      `Rejoining poll with ID: ${fields.pollID} for user with ID: ${fields.userID} with name: ${fields.name}`,
    );

    const joinedPoll = await this.pollsRepository.addParticipant(fields);

    return joinedPoll;
  }

  async get(pollID: string): Promise<Poll> {
    return await this.pollsRepository.getPoll(pollID);
  }

  async addParticipant(addParticipant: AddParticipantFields): Promise<Poll> {
    return this.pollsRepository.addParticipant(addParticipant);
  }

  async removeParticipant(
    fields: RemoveParticipantFields,
  ): Promise<Poll | void> {
    const poll = await this.pollsRepository.getPoll(fields.pollID);

    if (!poll.hasStarted) {
      const updatedPoll = await this.pollsRepository.removeParticipant(fields);
      return updatedPoll;
    }
  }

  async createNomination({
    pollID,
    text,
    userID,
  }: AddNominationFields): Promise<Poll> {
    const nominationID = createNominationID();
    const nomination = {
      userID: userID,
      text,
    };

    return this.pollsRepository.addNomination({
      nomination,
      nominationID,
      pollID,
    });
  }

  async removeNomination(pollID: string, nominationID: string): Promise<Poll> {
    return this.pollsRepository.removeNomination(pollID, nominationID);
  }
}
