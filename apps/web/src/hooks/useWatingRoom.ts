import useAppStore from "@/stores/useAppStore";

const useWaitingRoom = () => {
	const poll = useAppStore((state) => state.poll);
	const removeParticipant = useAppStore((state) => state.removeParticipant);
	const nominate = useAppStore((state) => state.nominate);
	const canStartVotes = useAppStore((state) => state.canStartVotes);
	const participantCount = useAppStore((state) => state.participantCount);
	const nominationCount = useAppStore((state) => state.nominationCount);
	const removeNomination = useAppStore((state) => state.removeNomination);
	const isAdmin = useAppStore((state) => state.isAdmin);
	const leavePool = useAppStore((state) => state.leavePool);
	const me = useAppStore((state) => state.me);
	const isOpen = useAppStore((state) => state.isOpen);
	const setOpen = useAppStore((state) => state.setOpen);
	const initializeSocket = useAppStore((state) => state.initializeSocket);
	const startVotes = useAppStore((state) => state.startVotes);

	return {
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
		isOpen,
		setOpen,
		initializeSocket,
		startVotes,
	};
};

export default useWaitingRoom;
