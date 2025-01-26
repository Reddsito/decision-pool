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
					setAnimationClass("page-leave");
					setTimeout(() => {
						next(); // Continúa a la siguiente página después de la animación
						setAnimationClass(""); // Resetea la clase
					}, 200); // Tiempo de la animación
				}}
				enter={(next) => {
					setAnimationClass("page-enter");
					next();
					setAnimationClass("");
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
