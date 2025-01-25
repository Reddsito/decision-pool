import { NominationID } from './nominations.types';

export type Rankings = {
  [userID: string]: NominationID[];
};

export type SubmitRankingsFields = {
  pollID: string;
  userID: string;
  rankings: string[];
};
