"use client";
import { createPoll } from "@/services/pollService";
import useAppStore from "@/stores/usePageStore";
import usePollStore from "@/stores/usePollStore";
import { useMutation } from "@tanstack/react-query";
import { useTransitionRouter } from "next-transition-router";
import { toast, Zoom } from "react-toastify";

const useCreatePoll = () => {
	const setPoll = usePollStore((state) => state.setPoll);
	const setAccessToken = useAppStore((state) => state.setAccessToken);
	const stopLoading = useAppStore((state) => state.stopLoading);
	const router = useTransitionRouter();

	return useMutation({
		mutationFn: createPoll,
		onSuccess: ({ accessToken, poll }) => {
			toast.success("Poll created successfully", {
				position: "top-right",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: false,
				draggable: true,
				theme: "light",
				transition: Zoom,
			});
			setAccessToken(accessToken);
			setPoll(poll);
			stopLoading();
			router.push("/waiting-room");
		},
		onError: (error) => {
			toast.error(error.message, {
				position: "top-right",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: false,
				draggable: true,
				theme: "light",
				transition: Zoom,
			});
			return;
		},
	});
};

export { useCreatePoll };
