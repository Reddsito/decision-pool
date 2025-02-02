"use client";

import useToast from "@/hooks/useToast";
import { useEffect, useState } from "react";
import { useCopyToClipboard } from "react-use";
import NominationForm from "../../components/NominationForm";
import { colorizeText } from "@/lib/utils";
import { MdContentCopy, MdPeopleOutline } from "react-icons/md";
import { BsPencilSquare } from "react-icons/bs";
import ConfirmationDialog from "../../components/ui/ConfirmationDialog";
import ParticipantList from "../../components/ParticipantList";
import { useTransitionRouter } from "next-transition-router";
import useWaitingRoom from "@/hooks/useWatingRoom";

const WaitingRoom = () => {
	const router = useTransitionRouter();
	const { showErrorToast } = useToast();
	const [_copiedText, copyToClipboard] = useCopyToClipboard();
	const [isParticipantListOpen, setIsParticipantListOpen] = useState(false);
	const [isNominationFormOpen, setIsNominationFormOpen] = useState(false);
	const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
	const [confirmationMessage, setConfirmationMessage] = useState("");
	const [participantToRemove, setParticipantToRemove] = useState<string>();
	const [showConfirmation, setShowConfirmation] = useState(false);
	const {
		poll,
		removeParticipant,
		nominate,
		canStartVotes,
		participantCount,
		nominationCount,
		removeNomination,
		isAdmin,
		leavePool,
		me,
		setOpen,
		initializeSocket,
		startVotes,
	} = useWaitingRoom();

	useEffect(() => {
		initializeSocket(showErrorToast);
	}, []);

	const confirmRemoveParticipant = (id: string) => {
		setConfirmationMessage(`Remove ${poll?.participants[id].name} from poll?`);
		setParticipantToRemove(id);
		setIsConfirmationOpen(true);
		setIsParticipantListOpen(false);
	};

	const submitRemoveParticipant = () => {
		participantToRemove && removeParticipant(participantToRemove);
		setIsConfirmationOpen(false);
	};

	const startVoting = () => {
		if (canStartVotes()) {
			startVotes();
			router.push("/voting");
		}
	};

	return (
		<>
			<div className="flex flex-col w-full justify-around items-stretch h-full mx-auto max-w-md">
				<div className="flex flex-col justify-center bg-white/80 p-6 rounded-lg shadow-lg box-border backdrop-blur">
					<h1 className="text-3xl text-center font-bold bg-gradient-to-r from-amber-500 to-red-500 bg-clip-text text-transparent ">
						Waiting room
					</h1>
					<div className="flex-1 flex flex-col items-center justify-center space-y-8 mt-8 mb-8">
						<div className="text-center space-y-1">
							<h2 className="text-2xl font-bold text-gray-700 text-center">
								Poll Topic
							</h2>
							<p className="text-xl text-gray-500 italic text-center">
								{poll?.topic}
							</p>
						</div>
						<div className="text-center space-y-2">
							<h2 className="text-2xl font-bold text-gray-600 ">Poll ID</h2>
							<div
								onClick={() => copyToClipboard(poll?.id || "")}
								className="mb-4 flex justify-center align-middle cursor-pointer">
								<div className="font-extrabold text-center mr-2 text-xl ">
									{poll && colorizeText(poll?.id)}
								</div>
								<MdContentCopy size={24} />
							</div>
							<h3 className="text-sm text-gray-500">Click to copy!</h3>
						</div>
					</div>

					<div className="flex justify-center space-x-8 mb-4">
						<button
							className="box btn-orange mx-2 pulsate"
							onClick={() => {
								setIsParticipantListOpen(true);
							}}>
							<MdPeopleOutline size={24} />
							<span>{participantCount()}</span>
						</button>
						<button
							className="box btn-red mx-2 pulsate"
							onClick={() => setIsNominationFormOpen(true)}>
							<BsPencilSquare size={24} />
							<span>{nominationCount()}</span>
						</button>
					</div>
					<div className="flex flex-col justify-center">
						{isAdmin() ? (
							<>
								<div className="my-2 italic">
									{poll?.votesPerVoter} Nominations Required to Start!
								</div>
								<button
									className={`w-full py-3 px-4 text-base font-medium text-white bg-gradient-to-r from-amber-400 to-red-500 hover:from-amber-500 hover:to-red-600 rounded-md shadow-md hover:shadow-lg transition-all duration-300 ${
										canStartVotes()
											? "opacity-100 cursor-pointer"
											: "opacity-50 cursor-not-allowed"
									}`}
									disabled={!canStartVotes()}
									onClick={() => startVoting()}>
									Start Voting
								</button>
							</>
						) : (
							<div className="my-2 italic">
								Waiting for Admin,{" "}
								<span className="font-semibold">
									{poll?.participants[poll?.adminID].name}{" "}
								</span>
								to start the voting.
							</div>
						)}
						<button
							className="box btn-orange my-2 pulsate-finite"
							onClick={() => {
								setShowConfirmation(true);
								setOpen(true);
							}}>
							Leave Poll
						</button>
					</div>
				</div>
			</div>
			<ParticipantList
				isOpen={isParticipantListOpen}
				onClose={() => {
					setIsParticipantListOpen(false);
				}}
				participants={poll?.participants}
				onRemoveParticipant={confirmRemoveParticipant}
				isAdmin={isAdmin() || false}
				userID={me()?.id}
			/>
			<NominationForm
				title={poll?.topic}
				isOpen={isNominationFormOpen}
				onClose={() => {
					setIsNominationFormOpen(false);
					setOpen(false);
				}}
				onSubmitNomination={(nominationText) => nominate(nominationText)}
				nominations={poll?.nominations}
				userID={me()?.id}
				onRemoveNomination={(nominationID) => removeNomination(nominationID)}
				isAdmin={isAdmin() || false}
			/>
			<ConfirmationDialog
				showDialog={isConfirmationOpen}
				message={confirmationMessage}
				onConfirm={() => {
					submitRemoveParticipant();
					setOpen(false);
				}}
				onCancel={() => {
					setIsConfirmationOpen(false);
					setOpen(false);
				}}
			/>
			<ConfirmationDialog
				message="You'll be kicked out of the poll"
				showDialog={showConfirmation}
				onCancel={() => {
					setShowConfirmation(false);
					setOpen(false);
				}}
				onConfirm={() => {
					leavePool();
					setShowConfirmation(false);
					router.push("/");
				}}
			/>
		</>
	);
};

export default WaitingRoom;
