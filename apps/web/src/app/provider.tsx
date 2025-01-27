"use client";
import { useState } from "react";
import { TransitionRouter } from "next-transition-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";
import { ToastContainer, Zoom } from "react-toastify";
import Loader from "@/components/ui/Loader";
import useAppStore from "@/stores/usePageStore";

export function Providers({ children }: { children: React.ReactNode }) {
	const [animationClass, setAnimationClass] = useState<string>("");
	const isLoading = useAppStore((state) => state.isLoading);

	return (
		<QueryClientProvider client={queryClient}>
			<TransitionRouter
				auto={true}
				leave={(next) => {
					// Página actual se mueve hacia arriba
					setAnimationClass("page-leave");
					setTimeout(() => {
						next(); // Continúa con la transición
					}, 400); // Duración de la animación de salida
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
