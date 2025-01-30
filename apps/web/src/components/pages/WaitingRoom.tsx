"use client";

import useToast from "@/hooks/useToast";
import useAppStore, { isAdmin } from "@/stores/useAppStore";
import { use, useEffect, useRef } from "react";

const WaitingRoom = () => {
	const initializeSocket = useAppStore((state) => state.initializeSocket);
	const { showErrorToast } = useToast();

	useEffect(() => {
		console.log("Waiting room useEffect");

		initializeSocket(showErrorToast);
	}, []);

	return <div>Waiting room</div>;
};

export default WaitingRoom;
