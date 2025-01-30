import { initialAppState, Me, Poll } from "@/types/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Socket } from "socket.io-client";
import { getTokenPayload } from "@/lib/utils";
import { createSocketWithHandlers, socketIOUrl } from "@/lib/socket.io";
import { access } from "fs";

type Actions = {
	startLoading: () => void;
	stopLoading: () => void;
	setAccessToken: (accessToken: string) => void;
	setPoll: (poll: Poll) => void;
	initializeSocket: (showErrorToast: (message: string) => void) => void;
	me: () => Me | undefined;
	updatePoll: (poll: Poll) => void;
	nominate: (text: string) => void;
	leavePool: () => void;
	removeNomination: (nominationID: string) => void;
	removeParticipant: (participantID: string) => void;
	startVotes: () => void;
};

export type AppStateStore = {
	isLoading: boolean;
	accessToken?: string;
	poll?: Poll;
	socket?: Socket;
} & Actions;

const useAppStore = create(
	devtools<AppStateStore>((set, get) => ({
		isLoading: initialAppState.isLoading,
		accessToken: undefined,
		poll: undefined,
		socket: undefined,
		startLoading: () => set({ isLoading: true }),
		stopLoading: () => set({ isLoading: false }),
		setAccessToken: (accessToken) => set({ accessToken }),
		setPoll: (poll: Poll) => set({ poll }),
		updatePoll: (poll: Poll) =>
			set((state) => ({ poll: { ...state.poll, ...poll } })),
		initializeSocket: (showErrorToast) => {
			const socket = get().socket;
			if (!socket) {
				set({
					socket: createSocketWithHandlers({
						socketIOUrl,
						state: get(),
						showErrorToast,
					}),
				});
			} else {
				get().socket?.connect();
			}
		},
		nominate: (message: string) => {
			get().socket?.emit("nominate", { text: message });
		},
		removeNomination: (nominationID: string) => {
			get().socket?.emit("remove_nomination", { id: nominationID });
		},
		removeParticipant: (participantID: string) => {
			get().socket?.emit("remove_participant", { id: participantID });
		},
		startVotes: () => {
			get().socket?.emit("start_poll");
		},
		leavePool: () => {
			get().socket?.disconnect();
			set({ poll: undefined, socket: undefined, accessToken: undefined });
			localStorage.removeItem("accessToken");
		},
		me: () => {
			const accessToken = get().accessToken;

			if (!accessToken) {
				return;
			}

			const token = getTokenPayload(accessToken);
			return { id: token.sub, name: token.name };
		},
	})),
);

export const isAdmin = (state: AppStateStore) => {
	const accessToken = state.accessToken;
	const poll = state.poll;

	if (!accessToken || !poll) return false;

	const token = state.me();

	if (!token) return false;

	return token.id === poll.adminID;
};

useAppStore.subscribe(({ accessToken }) => {
	if (accessToken) {
		localStorage.setItem("accessToken", accessToken);
	}
});

export default useAppStore;
