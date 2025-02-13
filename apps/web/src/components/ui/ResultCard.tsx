import { Results } from "@/types/types";
import React, { useState } from "react";

type ResultProps = {
	candidate: string;
	score: number;
	index: number;
};

const ResultCard = ({ candidate, score, index }: ResultProps) => {
	return (
		<div
			className={`flex justify-between py-3 border-b border-gray-100 ${
				index === 0 ? "bg-gradient-to-r from-amber-50 to-red-50" : ""
			}`}>
			<span className="text-base text-gray-700">{candidate}</span>
			<span
				className={`text-base font-medium ${
					index === 0 ? "text-amber-600" : "text-gray-600"
				}`}>
				{score.toFixed(2)}
			</span>
		</div>
	);
};

export default ResultCard;
