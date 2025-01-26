import { AppPage } from "@/types/enums";
import { AppState } from "@/types/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type Actions = {
	setPage: (page: AppPage) => void;
};

const usePageStore = create(
	devtools<AppState & Actions>((set) => ({
		currentPage: AppPage.Welcome,
		setPage: (page: AppPage) => set({ currentPage: page }),
	})),
);

export default usePageStore;
