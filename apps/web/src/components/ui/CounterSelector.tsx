import { useState } from "react";
import { useEffect } from "react";
import { BiMinus, BiPlus } from "react-icons/bi";

type CountSelectorProps = {
	min: number;
	max: number;
	step: number;
	initial: number;
	onChange: (val: number) => void;
};

const CountSelector: React.FC<CountSelectorProps> = ({
	min,
	max,
	step,
	initial,
	onChange,
}) => {
	if (initial < min || initial > max) {
		console.warn(
			`'initial' = ${initial} must in the rang eof ${min} and ${max}. Setting a default initial value`,
		);

		const steps = (max - min) / step;

		initial = min + Math.floor(steps);
	}

	const [current, setCurrent] = useState(initial);

	useEffect(() => {
		onChange(current);
	}, [current]);

	return (
		<div className="flex items-center justify-center gap-6">
			<button
				type="button"
				className="w-12 h-12 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
				disabled={current - step < min}
				onClick={() => setCurrent(current - step)}>
				<BiMinus className="w-6 h-6" />
			</button>
			<div className="text-2xl font-bold">{current}</div>
			<button
				type="button"
				className="w-12 h-12 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
				disabled={current + step > max}
				onClick={() => setCurrent(current + step)}>
				<BiPlus className="w-6 h-6" />
			</button>
		</div>
	);
};

export default CountSelector;
