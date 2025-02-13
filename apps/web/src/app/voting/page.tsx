"use client";

import ConfirmationDialog from "@/components/ui/ConfirmationDialog";
import RankedCheckBox from "@/components/ui/RankerCheckbox";
import useAppStore from "@/stores/useAppStore";
import { useTransitionRouter } from "next-transition-router";
import { useEffect, useState } from "react";

export default function Voting() {
	const [rankings, setRankings] = useState<string[]>([]);
	const [confirmCancel, setConfirmCancel] = useState(false);
	const [confirmVotes, setConfirmVotes] = useState(false);
	const poll = useAppStore((state) => state.poll);
	const setOpen = useAppStore((state) => state.setOpen);
	const submitRankings = useAppStore((state) => state.submitRankings);
	const isAdmin = useAppStore((state) => state.isAdmin);
	const cancellPoll = useAppStore((state) => state.cancellPoll);
	const me = useAppStore((state) => state.me);
	const router = useTransitionRouter();

	const toggleNomination = (id: string) => {
		const position = rankings.findIndex((ranking) => ranking === id);
		const hasVotesRemaining = (poll?.votesPerVoter || 0) - rankings.length > 0;

		if (position < 0 && hasVotesRemaining) {
			setRankings([...rankings, id]);
		} else if (position >= 0) {
			setRankings([
				...rankings.slice(0, position),
				...rankings.slice(position + 1, rankings.length),
			]);
		}
	};

	const getRank = (id: string) => {
		const position = rankings.findIndex((ranking) => ranking === id);
		return position < 0 ? undefined : position + 1;
	};

	useEffect(() => {
		console.log("hola");
	}, []);

	return (
		<div className="min-h-screen flex flex-col items-center justify-center p-4">
			<div className="w-full max-w-md bg-white/80 backdrop-blur rounded-lg shadow-lg p-6 relative">
				<div className="space-y-6">
					<div className="text-center space-y-2">
						<h1 className="text-3xl text-center font-bold bg-gradient-to-r from-amber-500 to-red-500 bg-clip-text text-transparent">
							Voting Page
						</h1>
						<p className="text-xl text-gray-600 font-medium">
							Select Your Top {poll?.votesPerVoter} Choices
						</p>
						<p className="text-lg text-amber-600 font-medium">
							{(poll?.votesPerVoter || 0) - rankings.length} Votes remaining
						</p>
					</div>

					<div className="space-y-3">
						{Object.entries(poll?.nominations || {}).map(([id, nomination]) => (
							<RankedCheckBox
								key={id}
								value={nomination.text}
								rank={getRank(id)}
								onSelect={() => toggleNomination(id)}
							/>
						))}
					</div>
				</div>
				<div className="space-y-3 pt-4">
					<button
						disabled={(poll?.votesPerVoter || 0) - rankings.length > 0}
						onClick={() => {
							setConfirmVotes(true);
							setOpen(true);
						}}
						className="w-full py-2.5 px-4 text-base font-medium text-white bg-gradient-to-r from-amber-400 to-red-500 hover:from-amber-500 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
						Submit Votes
					</button>

					{isAdmin() && (
						<button
							className="w-full py-2.5 px-4 text-base font-medium border-2 border-amber-300 hover:border-amber-400 hover:bg-amber-50 text-amber-700 rounded-lg transition-all duration-300"
							onClick={() => {
								setConfirmCancel(true);
								setOpen(true);
							}}>
							Cancel Poll
						</button>
					)}
				</div>
			</div>
			<ConfirmationDialog
				message="You cannot change your votes after submitting. Are you sure you want to submit?"
				showDialog={confirmVotes}
				onCancel={() => {
					setConfirmVotes(false);
					setOpen(false);
				}}
				onConfirm={() => {
					submitRankings(rankings);
					setOpen(false);
					router.push("/results");
				}}
			/>
			<ConfirmationDialog
				message="Are you sure you want to cancel the poll?"
				showDialog={confirmCancel}
				onCancel={() => {
					setConfirmCancel(false);
					setOpen(false);
				}}
				onConfirm={() => cancellPoll()}
			/>
		</div>
	);
}
