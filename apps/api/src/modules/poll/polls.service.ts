import { Injectable } from '@nestjs/common';

import { createPollID, createUserID } from 'src/lib/utils';
import { CreatePollFields } from './interfaces/create-poll.interface';
import { JoinPollFields } from './interfaces/join-poll.interface';
import { RejoinPollFields } from './interfaces/re-join.poll.interface';

@Injectable()
export class PollsService {
  async create(fields: CreatePollFields) {
    const pollID = createPollID();
    const userID = createUserID();

    return {
      ...fields,
      userID,
      pollID,
    };
  }

  async join(fields: JoinPollFields) {
    const userID = createUserID();

    return {
      ...fields,
      userID,
    };
  }

  async rejoin(fields: RejoinPollFields) {
    return fields;
  }
}
