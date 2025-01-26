import httpClient from "@/lib/http-client";
import { CreatePollData, Poll } from "@/types/types";

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
