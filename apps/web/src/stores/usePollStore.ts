import { initialPollState, Poll } from "@/types/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type Actions = {
	setPoll: (poll: Poll) => void;
};

type PollStore = {
	poll: Poll;
} & Actions;

const usePollStore = create(
	devtools<PollStore>((set) => ({
		poll: initialPollState,
		setPoll: (poll: Poll) => set({ poll }),
	})),
);

export default usePollStore;
