import { Nominations } from './nominations.types';
import { Participants } from './participant.types';

export type CreatePollData = {
  topic: string;
  votesPerVoter: number;
  pollID: string;
  userID: string;
};

export type CreatePollFields = {
  topic: string;
  votesPerVoter: number;
  name: string;
};

export type JoinPollData = {
  pollID: string;
  name: string;
};

export type JoinPollFields = {
  pollID: string;
  name: string;
};

export type RejoinPollData = {
  pollID: string;
  userID: string;
  name: string;
};

export type RejoinPollFields = {
  pollID: string;
  userID: string;
  name: string;
};

export type Poll = {
  id: string;
  topic: string;
  votesPerVoter: number;
  participants: Participants;
  adminID: string;
  nominations: Nominations;
  // rankings: Rankings;
  // results: Results;
  hasStarted: boolean;
};
