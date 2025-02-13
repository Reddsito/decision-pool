import { initialAppState, Me, Poll } from "@/types/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Socket } from "socket.io-client";
import { getTokenPayload } from "@/lib/utils";
import { createSocketWithHandlers, socketIOUrl } from "@/lib/socket.io";

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
	isAdmin: () => boolean;
	nominationCount: () => number;
	participantCount: () => number;
	canStartVotes: () => boolean;
	setOpen: (isOpen: boolean) => void;
	submitRankings: (rankings: string[]) => void;
	cancellPoll: () => void;
	hasVoted: () => boolean;
	rankingsCount: () => number;
};

export type AppStateStore = {
	isLoading: boolean;
	accessToken?: string;
	poll?: Poll;
	socket?: Socket;
	isOpen: boolean;
} & Actions;

const useAppStore = create(
	devtools<AppStateStore>((set, get) => ({
		isLoading: initialAppState.isLoading,
		accessToken: undefined,
		poll: undefined,
		socket: undefined,
		isOpen: false,
		setOpen: (isOpen) => set({ isOpen }),
		nominationCount: () => Object.keys(get().poll?.nominations || {}).length,
		participantCount: () => Object.keys(get().poll?.participants || {}).length,
		canStartVotes: () => {
			const votesPerVoter = get().poll?.votesPerVoter ?? 100;
			return get().nominationCount() >= votesPerVoter;
		},
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

				return;
			}

			if (!socket.connected) {
				socket?.connect();
				return;
			}
		},
		nominate: (message: string) => {
			get().socket?.emit("nominate", { text: message });
			set({ isOpen: false });
		},
		removeNomination: (nominationID: string) => {
			get().socket?.emit("remove_nomination", { id: nominationID });
			set({ isOpen: false });
		},
		removeParticipant: (participantID: string) => {
			get().socket?.emit("remove_participant", { id: participantID });
			set({ isOpen: false });
		},
		submitRankings: (rankings: string[]) => {
			get().socket?.emit("submit_rankings", { rankings });
			set({ isOpen: false });
		},
		startVotes: () => {
			get().socket?.emit("start_poll");
			set({ isOpen: false });
		},
		cancellPoll: () => {
			get().socket?.emit("delete_poll");
			set({ isOpen: false });
		},
		leavePool: () => {
			get().socket?.disconnect();
			set({ poll: undefined, socket: undefined, accessToken: undefined });
			localStorage.removeItem("accessToken");
			set({ isOpen: false });
		},
		hasVoted: () => {
			const rankings = get().poll?.rankings || {};
			const id = get().me()?.id || "";

			return rankings[id] !== undefined ? true : false;
		},
		rankingsCount: () => {
			return Object.keys(get().poll?.rankings || {}).length;
		},
		me: () => {
			const accessToken = get().accessToken;

			if (!accessToken) {
				return;
			}

			const token = getTokenPayload(accessToken);
			return { id: token.sub, name: token.name };
		},
		isAdmin: () => {
			const accessToken = get().accessToken;
			const poll = get().poll;

			if (!accessToken || !poll) return false;

			const token = get().me();

			if (!token) return false;

			return token.id === poll.adminID;
		},
	})),
);

useAppStore.subscribe(({ accessToken }) => {
	if (accessToken) {
		localStorage.setItem("accessToken", accessToken);
	}
});

export default useAppStore;
