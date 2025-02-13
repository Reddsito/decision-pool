"use client";
import { useEffect, useState } from "react";
import { TransitionRouter, useTransitionRouter } from "next-transition-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";
import { ToastContainer, Zoom } from "react-toastify";
import Loader from "@/components/ui/Loader";
import useAppStore from "@/stores/useAppStore";
import useToast from "@/hooks/useToast";
import { getTokenPayload } from "@/lib/utils";

export function Providers({ children }: { children: React.ReactNode }) {
	const [animationClass, setAnimationClass] = useState<string>("");
	const isLoading = useAppStore((state) => state.isLoading);
	const accessToken = localStorage.getItem("accessToken");
	const stopLoading = useAppStore((state) => state.stopLoading);
	const startLoading = useAppStore((state) => state.startLoading);
	const setAccessToken = useAppStore((state) => state.setAccessToken);
	const initializeSocket = useAppStore((state) => state.initializeSocket);
	const me = useAppStore((state) => state.me);
	const leavePoll = useAppStore((state) => state.leavePool);
	const participants = useAppStore((state) => state.poll?.participants);
	const socket = useAppStore((state) => state.socket);
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

	return (
		<QueryClientProvider client={queryClient}>
			<TransitionRouter
				auto={true}
				leave={(next) => {
					// Página actual se mueve hacia arriba
					setAnimationClass("page-leave");
					setTimeout(() => {
						next(); // Continúa con la transición
					}, 250); // Duración de la animación de salida
				}}
				enter={(next) => {
					// Nueva página inicia desde abajo y sube
					setAnimationClass("page-enter-active");
					setTimeout(() => {
						setAnimationClass("page-enter");
					}, 10); // Pequeño retraso para activar la transición

					setTimeout(() => {
						setAnimationClass(""); // Limpia las clases después de la animación
						next();
					}, 700); // Duración de la animación de entrada
				}}>
				<main className={`page ${animationClass}`}>{children}</main>
				<ToastContainer
					position="top-right"
					autoClose={3000}
					hideProgressBar={false}
					newestOnTop
					closeOnClick
					rtl={false}
					pauseOnFocusLoss={false}
					draggable
					pauseOnHover={false}
					theme="light"
					transition={Zoom}
				/>
				<Loader
					isLoading={isLoading}
					color="orange"
					width={120}
				/>
			</TransitionRouter>
		</QueryClientProvider>
	);
}
