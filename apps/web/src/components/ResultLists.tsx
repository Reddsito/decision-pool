import React from "react";
import ResultCard from "./ui/ResultCard";
import HorizontalSwipeList from "./ui/HorizontalSwipeList";
import { BiX } from "react-icons/bi";
import { Results } from "@/types/types";

type ResultsListProps = {
	results: Readonly<Results>;
	rankingsCount: number;
	participantCount: number;
};

const ResultsList = ({
	results,
	participantCount,
	rankingsCount,
}: ResultsListProps) => {
	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold text-center text-gray-700">Results</h1>

			{results && results.length > 0 ? (
				<div className="space-y-1">
					<div className="flex justify-between py-2 border-b-2 border-gray-200">
						<span className="text-lg font-medium text-gray-600">Candidate</span>
						<span className="text-lg font-medium text-gray-600">Score</span>
					</div>
					<div className="mx-auto max-h-full flex flex-col">
						{results.map((result, i) => (
							<ResultCard
								key={i}
								candidate={result.nominationID}
								score={result.votes}
								index={i}
							/>
						))}
					</div>
				</div>
			) : (
				<p className="text-lg text-gray-600 font-medium text-center">
					<span className="text-orange-600">{participantCount} of</span>{" "}
					<span className="text-red-600">{rankingsCount}</span> Participants
					have voted
				</p>
			)}
		</div>
	);
};

export default ResultsList;
