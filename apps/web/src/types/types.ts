export type AppState = {
	isLoading: boolean;
	accessToken: string;
};

export interface CreatePollData {
	topic: string;
	votesPerVoter: number;
	name: string;
}

export interface JoinPollFields {
	pollID: string;
	name: string;
}

export interface JoinPollData {
	pollID: string;
	name: string;
	signal?: AbortSignal;
}

export interface ApiError {
	message: string | string[];
	statusCode: number;
	error: string;
}

export type Participants = {
	[participantID: string]: {
		name: string;
	};
};

export type NominationID = string;

export type Nominations = {
	[nominationID: NominationID]: Nomination;
};

export type Nomination = {
	userID: string;
	text: string;
};

export type Rankings = {
	[userID: string]: NominationID[];
};

export type Results = {
	nominationID: NominationID;
	nominationText: string;
	votes: number;
}[];

export type Poll = {
	id: string;
	topic: string;
	votesPerVoter: number;
	participants: Participants;
	adminID: string;
	nominations: Nominations;
	rankings: Rankings;
	results?: Results;
	hasStarted: boolean;
	hasFinished: boolean;
};

export const initialPollState = {
	id: "",
	topic: "",
	votesPerVoter: 0,
	participants: {},
	adminID: "",
	nominations: {},
	rankings: {},
	results: undefined,
	hasStarted: false,
	hasFinished: false,
};

export const initialAppState = {
	isLoading: false,
	accessToken: "",
	poll: initialPollState,
};

export type Me = {
	id: string;
	name: string;
};
