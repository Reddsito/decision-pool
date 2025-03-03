import { BadRequestException, Injectable, Logger } from '@nestjs/common';

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
import { SubmitRankingsFields } from './types/ranking.types';
import getResults from 'src/lib/get-results';

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

    if (joinedPoll.hasStarted) {
      throw new BadRequestException('Poll has already started');
    }

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
    return await this.pollsRepository.addParticipant(addParticipant);
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

    return await this.pollsRepository.addNomination({
      nomination,
      nominationID,
      pollID,
    });
  }

  async removeNomination(pollID: string, nominationID: string): Promise<Poll> {
    return await this.pollsRepository.removeNomination(pollID, nominationID);
  }

  async submitRankings(rankingsData: SubmitRankingsFields) {
    const pool = await this.pollsRepository.getPoll(rankingsData.pollID);

    if (!pool.hasStarted) {
      throw new BadRequestException('Participants cannot submit rankings yet');
    }

    return await this.pollsRepository.addParticipantRankings(rankingsData);
  }

  async startPoll(pollID: string): Promise<Poll> {
    return await this.pollsRepository.startPoll(pollID);
  }

  async cancelPoll(pollID: string) {
    await this.pollsRepository.deletePoll(pollID);
    return;
  }

  async computeResults(pollID: string): Promise<Poll> {
    const poll = await this.pollsRepository.getPoll(pollID);

    if (poll.hasFinished) {
      throw new BadRequestException('Poll has already finished');
    }

    const results = getResults(
      poll.rankings,
      poll.nominations,
      poll.votesPerVoter,
    );

    return await this.pollsRepository.addResults(pollID, results);
  }
}
