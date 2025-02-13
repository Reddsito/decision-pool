"use client";

import useToast from "@/hooks/useToast";
import { getTokenPayload } from "@/lib/utils";
import useAppStore from "@/stores/useAppStore";
import { useTransitionRouter } from "next-transition-router";
import { useEffect } from "react";

const TokenHandler = () => {
	const accessToken = localStorage.getItem("accessToken");
	const stopLoading = useAppStore((state) => state.stopLoading);
	const startLoading = useAppStore((state) => state.startLoading);
	const setAccessToken = useAppStore((state) => state.setAccessToken);
	const initializeSocket = useAppStore((state) => state.initializeSocket);
	const me = useAppStore((state) => state.me);
	const leavePoll = useAppStore((state) => state.leavePool);
	const participants = useAppStore((state) => state.poll?.participants);
	const socket = useAppStore((state) => state.socket);
	const hasVoted = useAppStore((state) => state.hasVoted);
	const { showErrorToast } = useToast();
	const router = useTransitionRouter();

	useEffect(() => {
		startLoading();
		if (!accessToken) {
			stopLoading();
			return;
		}

		const { exp: tokenExp } = getTokenPayload(accessToken);
		const currentTimeInSeconds = Date.now() / 1000;

		if (tokenExp < currentTimeInSeconds - 10) {
			localStorage.removeItem("accessToken");
			stopLoading();
			return;
		}

		setAccessToken(accessToken);
		initializeSocket(showErrorToast);
	}, []);

	useEffect(() => {
		const myId = me()?.id;

		if (socket?.connected && myId && !participants?.[myId]) {
			localStorage.removeItem("accessToken");
			leavePoll();
			router.push("/");
		}
	}, [participants]);

	return null;
};

export default TokenHandler;
