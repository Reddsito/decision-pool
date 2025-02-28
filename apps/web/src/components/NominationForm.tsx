import React, { useState } from "react";
import { MdCancel } from "react-icons/md";
import { Nominations } from "@/types/types";
import { BiChevronLeft } from "react-icons/bi";

type NominationFormProps = {
	title?: string;
	nominations?: Nominations;
	userID?: string;
	isAdmin: boolean;
	onSubmitNomination: (nomination: string) => void;
	onRemoveNomination: (nominationID: string) => void;
	isOpen: boolean;
	onClose: () => void;
};

const NominationForm: React.FC<NominationFormProps> = ({
	isOpen,
	title,
	nominations = {},
	onSubmitNomination,
	onRemoveNomination,
	userID,
	isAdmin,
	onClose,
}) => {
	const [nominationText, setNominationText] = useState<string>("");

	const handleSubmitNomination = (nominationText: string) => {
		onSubmitNomination(nominationText);
		setNominationText("");
	};

	const getBoxStyle = (id: string): string => {
		return id === userID ? "bg-orange-100 " : "bg-gray-100 flex-row-reverse";
	};
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center p-4">
			<div className="flex flex-col items-center justify-between w-full max-w-md bg-white rounded-lg shadow-xl p-6 animate-in fade-in zoom-in duration-200">
				<div className="space-y-4 w-full">
					<div className="flex items-center justify-around relative w-full">
						<button
							className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-red-500 hover:from-amber-500 hover:to-red-600 text-white transition-colors absolute top-0 left-0"
							aria-label="Go back"
							onClick={onClose}>
							<BiChevronLeft className="w-6 h-6" />
						</button>
						<h2 className="text-2xl font-bold text-center text-gray-700">
							Poll Topic
						</h2>
					</div>
					<h2 className="text-gray-700 font-medium text-center">{title}</h2>

					<div className="space-y-4 ">
						<textarea
							rows={2}
							maxLength={100}
							className="w-full min-h-[120px] p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 transition-colors resize-none"
							value={nominationText}
							placeholder="Write your nomination here"
							onChange={(e) => setNominationText(e.currentTarget.value)}
						/>

						<button
							className="box btn-orange w-full my-2 pulsate-finite"
							disabled={!nominationText.length || nominationText.length > 100}
							onClick={() => handleSubmitNomination(nominationText)}>
							Nominate
						</button>
					</div>
					<div className="pt-4 border-t border-gray-200">
						<h2 className="text-xl font-medium text-gray-700 text-center">
							Nominations
						</h2>
					</div>
				</div>
				<div className="w-full mb-2 space-y-2">
					{Object.entries(nominations).map(([nominationID, nomination]) => (
						<div
							key={nominationID}
							className={`relative  rounded-lg p-3 flex justify-between items-center  ${getBoxStyle(
								nomination.userID,
							)}`}>
							<div>{nomination.text}</div>
							{isAdmin && (
								<div className="ml-2">
									<MdCancel
										className="fill-current cursor-pointer hover:opacity-80"
										onClick={() => onRemoveNomination(nominationID)}
										size={24}
									/>
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default NominationForm;
