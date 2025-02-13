import { AppStateStore } from "@/stores/useAppStore";
import { io, Socket } from "socket.io-client";

export const socketIOUrl = `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_POLLS_NAMESPACE}`;

type CreateSocketOptions = {
	socketIOUrl: string;
	state: AppStateStore;
	showErrorToast: (message: string) => void;
};

export const createSocketWithHandlers = ({
	socketIOUrl,
	state,
	showErrorToast,
}: CreateSocketOptions): Socket => {
	console.log(`Creating socket with accessToken: ${state.accessToken}`);

	const token = state.accessToken;
	const socket = io(socketIOUrl, {
		auth: {
			token,
		},
		transports: ["websocket", "polling"],
		reconnection: false,
	});

	socket.on("connect_error", (error) => {
		showErrorToast("Failed to connect to the pool");
	});

	socket.on("connect", () => {
		console.log(
			`Connected with socket ID: ${socket.id}. UserID: ${
				state.me()?.id
			} will join room ${state.poll?.id}`,
		);

		state.stopLoading();
	});

	socket.on("poll_updated", (poll) => {
		console.log('event: "poll_updated" received', poll);
		state.updatePoll(poll);
	});

	socket.on("delete_poll", (poll) => {
		console.log('event: "poll_updated" received', poll);
		state.updatePoll(poll);
	});

	return socket;
};
