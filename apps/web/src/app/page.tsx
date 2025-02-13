"use client";
import useAppStore from "@/stores/useAppStore";
import { useTransitionRouter } from "next-transition-router";
import Link from "next/link";
import { useEffect } from "react";

export default function Welcome() {
	const me = useAppStore((state) => state.me);
	const poll = useAppStore((state) => state.poll);
	const hasVoted = useAppStore((state) => state.hasVoted);
	const router = useTransitionRouter();

	useEffect(() => {
		if (me()?.id && !poll?.hasStarted) {
			router.push("/waiting-room");
		}

		if (me()?.id && poll?.hasStarted) {
			router.push("/voting");
		}

		if (me()?.id && hasVoted()) {
			router.push("/results");
		}
	}, [me()?.id, poll?.hasStarted, hasVoted()]);

	return (
		<div className="flex flex-col justify-center items-center h-screen ">
			<div className="w-full max-w-md  backdrop-blur rounded-lg p-6 space-y-6 ">
				<h1 className="text-3xl font-bold text-center bg-gradient-to-r from-amber-500 to-red-500 bg-clip-text text-transparent mb-10">
					Welcome to Decision Pool
				</h1>
				<div className="my-12 flex flex-col justify-center space-y-3">
					<Link
						className="text-center text-bold w-full py-2 px-4 text-base font-medium text-white bg-gradient-to-r from-amber-400 to-red-500 hover:from-amber-500 hover:to-red-600 rounded-md shadow-md hover:shadow-lg transition-all duration-300 pulsate"
						href={"/create"}>
						Create New Pool
					</Link>
					<Link
						className="box btn-orange my-2 pulsate"
						href={"/join"}>
						Join Existing poll
					</Link>
				</div>
			</div>
		</div>
	);
}
