import React from "react";

type RankedCheckBoxProps = {
	rank?: number;
	value: string;
	onSelect: () => void;
};

const RankedCheckBox = ({ value, rank, onSelect }: RankedCheckBoxProps) => {
	return (
		<div
			className={`relative w-full text-left p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer ${
				rank
					? "border-amber-500 bg-amber-50"
					: "border-gray-200 hover:border-amber-300"
			}`}
			onClick={() => onSelect()}>
			<span className="text-lg font-medium text-amber-700">{value}</span>
			{rank && (
				<div className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-sm font-medium">
					<div className="text-center font-medium text-white">{rank}</div>
				</div>
			)}
		</div>
	);
};

export default RankedCheckBox;
