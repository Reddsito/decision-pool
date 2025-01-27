import httpClient from "@/lib/http-client";
import { CreatePollData, JoinPollData, Poll } from "@/types/types";

type CreatePollResponse = {
	poll: Poll;
	accessToken: string;
};

export const createPoll = async (
	data: CreatePollData,
): Promise<CreatePollResponse> => {
	const response = await httpClient<CreatePollResponse>("polls", {
		method: "POST",
		body: JSON.stringify(data),
	});

	return response;
};

type JoinPollResponse = {
	poll: Poll;
	accessToken: string;
};

export const joinPoll = async ({ pollID, name, signal }: JoinPollData) => {
	const response = await httpClient<JoinPollResponse>("polls/join", {
		method: "POST",
		body: JSON.stringify({ pollID, name }),
		signal,
	});

	return response;
};
