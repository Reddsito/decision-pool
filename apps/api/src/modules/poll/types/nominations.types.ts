export type Nominations = {
  [nominationID: string]: string;
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
