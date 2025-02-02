"use client";

import { useState } from "react";

export default function Voting() {
	const [rankings, setRankings] = useState<string[]>([]);
	const [confirmCancel, setConfirmCancel] = useState(false);
	const [confirmVotes, setConfirmVotes] = useState(false);

	return (
		<div className="min-h-screen flex flex-col items-center justify-center p-4">
			<div className="w-full max-w-md bg-white/80 backdrop-blur rounded-lg shadow-lg p-6 relative">
				Hola
			</div>
		</div>
	);
}
