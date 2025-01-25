import { NominationID } from './nominations.types';

export type Results = {
  nominationID: NominationID;
  nominationText: string;
  votes: number;
}[];
