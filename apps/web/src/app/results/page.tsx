"use client";

import useAppStore from "@/stores/useAppStore";
import { useState } from "react";
import { BiX } from "react-icons/bi";

const results = () => {
	const results = [
		{ candidate: "Los Alazanes", score: 2.3 },
		{ candidate: "Papa's Tacos", score: 1.69 },
		{ candidate: "In N Out Burger", score: 0.99 },
		{ candidate: "Tacos Güero", score: 0.69 },
		{ candidate: "Taco Bell", score: 0.3 },
	];
	const isAdmin = useAppStore((state) => state.isAdmin);
	const participantCount = useAppStore((state) => state.participantCount);
	const poll = useAppStore((state) => state.poll);
	const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
	const [isLeavePollOpen, setIsLeavePollOpen] = useState(false);

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-amber-50 to-red-100 p-4">
			<div className="w-full max-w-md bg-white/80 backdrop-blur rounded-lg shadow-lg p-6 relative">
				<button
					className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-red-500 hover:from-amber-500 hover:to-red-600 text-white transition-colors"
					aria-label="Close">
					<BiX className="w-5 h-5" />
				</button>

				<div className="space-y-6">
					<h1 className="text-2xl font-bold text-center text-gray-700">
						Results
					</h1>

					<div className="space-y-1">
						<div className="flex justify-between py-2 border-b-2 border-gray-200">
							<span className="text-lg font-medium text-gray-600">
								Candidate
							</span>
							<span className="text-lg font-medium text-gray-600">Score</span>
						</div>

						{results.map((result, index) => (
							<div
								key={index}
								className={`flex justify-between py-3 border-b border-gray-100 ${
									index === 0 ? "bg-gradient-to-r from-amber-50 to-red-50" : ""
								}`}>
								<span className="text-base text-gray-700">
									{result.candidate}
								</span>
								<span
									className={`text-base font-medium ${
										index === 0 ? "text-amber-600" : "text-gray-600"
									}`}>
									{result.score.toFixed(2)}
								</span>
							</div>
						))}
					</div>

					<button className="w-full py-2.5 px-4 text-base font-medium border-2 border-amber-300 hover:border-amber-400 hover:bg-amber-50 text-amber-700 rounded-lg transition-all duration-300">
						Leave Poll
					</button>
				</div>
			</div>
		</div>
	);
};

export default results;
