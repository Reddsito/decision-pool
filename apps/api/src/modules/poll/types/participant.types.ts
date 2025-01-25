export type AddParticipantData = {
  pollID: string;
  userID: string;
  name: string;
};

export type AddParticipantFields = {
  pollID: string;
  userID: string;
  name: string;
};

export type RemoveParticipantFields = {
  pollID: string;
  userID: string;
};

export type RemoveParticipantData = {
  pollID: string;
  userID: string;
};

export type AddParticipantRankingsData = {
  pollID: string;
  userID: string;
  rankings: string[];
};

export type Participants = {
  [participantID: string]: string;
};
