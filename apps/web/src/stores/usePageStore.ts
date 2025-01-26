import { AppState, initialAppState } from "@/types/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type Actions = {
	startLoading: () => void;
	stopLoading: () => void;
	setAccessToken: (accessToken: string) => void;
};

type AppStateStore = {
	isLoading: boolean;
	accessToken: string;
} & Actions;

const useAppStore = create(
	devtools<AppStateStore>((set) => ({
		isLoading: initialAppState.isLoading,
		accessToken: initialAppState.accessToken,
		startLoading: () => set({ isLoading: true }),
		stopLoading: () => set({ isLoading: false }),
		setAccessToken: (accessToken) => set({ accessToken }),
	})),
);

export default useAppStore;
