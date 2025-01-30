"use client";
import { createPoll, joinPoll } from "@/services/pollService";
import useAppStore from "@/stores/useAppStore";
import { useMutation } from "@tanstack/react-query";
import { useTransitionRouter } from "next-transition-router";
import { JoinPollFields } from "@/types/types";
import { useRef } from "react";
import useToast from "./useToast";

const usePoll = () => {
	const setPoll = useAppStore((state) => state.setPoll);
	const setAccessToken = useAppStore((state) => state.setAccessToken);
	const stopLoading = useAppStore((state) => state.stopLoading);
	const { showErrorToast, showSuccessToast } = useToast();
	const abortControllerRef = useRef<AbortController | null>(null);
	const router = useTransitionRouter();

	const useCreatePoll = useMutation({
		mutationFn: createPoll,
		onSuccess: ({ accessToken, poll }) => {
			showSuccessToast("Poll created successfully");
			setAccessToken(accessToken);
			setPoll(poll);
			stopLoading();
			router.push("/waiting-room");
		},
		onError: (error) => {
			showErrorToast(error);
			stopLoading();
		},
	});

	const useJoinPoll = useMutation({
		mutationFn: async (data: JoinPollFields) => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}

			const controller = new AbortController();

			abortControllerRef.current = controller;

			const signal = controller.signal;

			const response = await joinPoll({ ...data, signal });

			return response;
		},
		onSuccess: ({ accessToken, poll }) => {
			showSuccessToast("Joined poll successfully");
			setAccessToken(accessToken);
			setPoll(poll);
			stopLoading();
			router.push("/waiting-room");
		},
		onError: (error) => {
			showErrorToast(error);
			stopLoading();
		},
	});

	return { useCreatePoll, useJoinPoll };
};

export default usePoll;
