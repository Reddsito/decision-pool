interface LabelProps {
	label: string;
}

const Label = ({ label }: LabelProps) => {
	return (
		<label className="block text-2xl text-center text-gray-700 font-medium">
			{label}
		</label>
	);
};

export default Label;
