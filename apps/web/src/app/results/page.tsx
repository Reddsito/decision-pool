"use client";

import ResultsList from "@/components/ResultLists";
import ConfirmationDialog from "@/components/ui/ConfirmationDialog";
import useAppStore from "@/stores/useAppStore";
import { useTransitionRouter } from "next-transition-router";
import { use, useEffect, useState } from "react";

const results = () => {
	const isAdmin = useAppStore((state) => state.isAdmin);
	const participantCount = useAppStore((state) => state.participantCount);
	const poll = useAppStore((state) => state.poll);
	const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
	const [isLeavePollOpen, setIsLeavePollOpen] = useState(false);
	const rankingsCount = useAppStore((state) => state.rankingsCount);
	const setOpen = useAppStore((state) => state.setOpen);
	const closePoll = useAppStore((state) => state.closePoll);
	const leavePoll = useAppStore((state) => state.leavePool);
	const me = useAppStore((state) => state.me);
	const hasVoted = useAppStore((state) => state.hasVoted);
	const router = useTransitionRouter();

	useEffect(() => {
		if (me()?.id && !poll?.hasStarted) {
			router.push("/waiting-room");
		}

		if (me()?.id && !hasVoted()) {
			console.log(poll?.hasStarted);
			router.push("/voting");
		}

		if (!me()?.id) {
			router.push("/");
		}
	}, [me()?.id, poll?.hasStarted, hasVoted]);

	return (
		<>
			{" "}
			<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-amber-50 to-red-100 p-4">
				<div className="w-full max-w-md bg-white/80 backdrop-blur rounded-lg shadow-lg p-6 relative space-y-4">
					<ResultsList
						results={poll?.results!}
						rankingsCount={rankingsCount()}
						participantCount={participantCount()}
					/>
					<div className="space-y-8">
						{isAdmin() && !poll?.results?.length && (
							<button
								className="w-full py-3 px-4 text-base font-medium text-white bg-gradient-to-r from-amber-400 to-red-500 hover:from-amber-500 hover:to-red-600 rounded-md shadow-md hover:shadow-lg transition-all duration-300 "
								onClick={() => {
									setIsConfirmationOpen(true);
									setOpen(true);
								}}>
								End poll
							</button>
						)}
					</div>
					{!isAdmin() && !poll?.results?.length && (
						<div className="my-2 italic">
							Waiting for admin,{" "}
							<span className="font-semibold">
								{poll?.participants[poll.adminID].name}
							</span>
							, to end the poll.
						</div>
					)}
					{!!poll?.results?.length && (
						<button
							className="w-full py-2.5 px-4 text-base font-medium border-2 border-amber-300 hover:border-amber-400 hover:bg-amber-50 text-amber-700 rounded-lg transition-all duration-300"
							onClick={() => {
								setIsLeavePollOpen(true);
								setOpen(true);
							}}>
							Leave the poll
						</button>
					)}
				</div>
			</div>
			<ConfirmationDialog
				message="Are you sure you want to end the poll?"
				showDialog={isConfirmationOpen}
				onCancel={() => {
					setIsConfirmationOpen(false);
					setOpen(false);
				}}
				onConfirm={() => {
					closePoll();
					setOpen(false);
					setIsConfirmationOpen(false);
				}}
			/>
			<ConfirmationDialog
				message="Are you sure you want to leave the poll?"
				showDialog={isLeavePollOpen}
				onCancel={() => {
					setIsLeavePollOpen(false);
					setOpen(false);
				}}
				onConfirm={() => {
					leavePoll();
					router.push("/");
					setOpen(false);
				}}
			/>
		</>
	);
};

export default results;
