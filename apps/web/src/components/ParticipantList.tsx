import React from "react";
import { Participants } from "@/types/types";
import { BiChevronLeft } from "react-icons/bi";
import { MdCancel } from "react-icons/md";

type ParticipantListProps = {
	participants?: Participants;
	userID?: string;
	isAdmin: boolean;
	onRemoveParticipant: (id: string) => void;
	isOpen: boolean;
	onClose: () => void;
};

const ParticipantList = ({
	isOpen,
	onClose,
	participants = {},
	onRemoveParticipant,
	userID,
	isAdmin,
}: ParticipantListProps) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center p-4">
			{/* Header */}
			<div className="flex flex-col items-center justify-between w-full max-w-sm bg-white rounded-lg shadow-xl p-6 animate-in fade-in zoom-in duration-200">
				<div className="flex items-center justify-around relative w-full">
					<button
						className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-red-500 hover:from-amber-500 hover:to-red-600 text-white transition-colors absolute left-0"
						aria-label="Go back"
						onClick={onClose}>
						<BiChevronLeft className="w-6 h-6" />
					</button>
					<h2 className="text-2xl font-bold text-center text-gray-700">
						Participant List
					</h2>
				</div>
				{/* Participant List */}
				<ul className="space-y-2 flex flex-col w-full pt-4">
					{Object.entries(participants).map(([id, participant]) => {
						return (
							<li
								key={id}
								className="flex items-center justify-between bg-white rounded-lg shadow-md p-3 transition-all hover:shadow-lg animate-fade-in-up ">
								<span className="text-lg font-medium text-amber-700">
									{participant.name} {/* Accede a 'name' correctamente */}
								</span>

								{isAdmin && (
									<>
										{id !== userID ? (
											<button
												className="p-1 text-gray-400 hover:text-red-500 transition-colors"
												aria-label={`Remove ${participant.name}`}
												onClick={() => onRemoveParticipant(id)}>
												<MdCancel className="w-5 h-5" />
											</button>
										) : (
											<span className="text-sm font-bold bg-gradient-to-r from-amber-500 to-red-500 bg-clip-text text-transparent">
												You
											</span>
										)}
									</>
								)}
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
};

export default ParticipantList;
