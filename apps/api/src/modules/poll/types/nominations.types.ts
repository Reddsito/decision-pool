export type Nominations = {
  [nominationID: NominationID]: Nomination;
};

export type AddNominationFields = {
  pollID: string;
  userID: string;
  text: string;
};

export type AddNominationData = {
  pollID: string;
  nominationID: string;
  nomination: Nomination;
};

export type Nomination = {
  userID: string;
  text: string;
};

export type NominationID = string;
