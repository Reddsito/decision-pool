import React from "react";
import Label from "./Label";
import { UseFormRegister } from "react-hook-form";

interface InputFieldProps {
	label: string;
	name: string;
	register: UseFormRegister<any>;
	placeholder: string;
	errors?: any;
}

const InputField = ({
	label,
	register,
	errors,
	placeholder,
	name,
}: InputFieldProps) => {
	return (
		<div className="space-y-2">
			<Label label={label} />
			<input
				type="text"
				{...register(name)}
				className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
				placeholder={placeholder}
			/>
			{errors && errors[name] && (
				<p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
			)}
		</div>
	);
};

export default InputField;
