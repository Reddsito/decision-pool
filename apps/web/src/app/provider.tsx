"use client";
import { useState } from "react";
import { TransitionRouter } from "next-transition-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";

export function Providers({ children }: { children: React.ReactNode }) {
	const [animationClass, setAnimationClass] = useState<string>("");

	return (
		<QueryClientProvider client={queryClient}>
			<TransitionRouter
				auto={true}
				leave={(next) => {
					setAnimationClass("page-leave");
					setTimeout(() => {
						next(); // Continúa a la siguiente página después de la animación
						setAnimationClass(""); // Resetea la clase
					}, 400); // Tiempo de la animación
				}}
				enter={(next) => {
					setAnimationClass("page-enter");
					next();
					setAnimationClass("");
				}}>
				<main className={`page ${animationClass}`}>{children}</main>
			</TransitionRouter>
		</QueryClientProvider>
	);
}
