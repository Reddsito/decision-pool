"use client";
import InputField from "../../components/InputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { joinPollSchema } from "@/schemas/pollSchema";
import usePoll from "@/hooks/usePolls";
import { useForm } from "react-hook-form";
import { Link, useTransitionRouter } from "next-transition-router";
import { BsArrowLeftShort } from "react-icons/bs";
import useAppStore from "@/stores/useAppStore";
import { useEffect } from "react";

const JoinPoll = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(joinPollSchema),
	});

	const {
		useJoinPoll: { mutate, isPending },
	} = usePoll();
	const startLoading = useAppStore((state) => state.startLoading);

	const onSubmit = (data: any) => {
		startLoading();
		mutate({
			name: data.name,
			pollID: data.pollID.toUpperCase(),
		});
	};
	const me = useAppStore((state) => state.me);
	const poll = useAppStore((state) => state.poll);
	const router = useTransitionRouter();

	useEffect(() => {
		if (me()?.id && !poll?.hasStarted) {
			router.push("/waiting-room");
		}

		if (me()?.id && poll?.hasStarted) {
			router.push("/voting");
		}
	}, [me()?.id, poll?.hasStarted]);

	return (
		<div className="flex flex-col w-full justify-around items-stretch h-full mx-auto max-w-md">
			<div className=" flex flex-col justify-center relative bg-white/80 p-6 rounded-lg shadow-lg box-border backdrop-blur ">
				<form
					className="space-y-4"
					onSubmit={handleSubmit(onSubmit)}>
					<Link
						href="/"
						className="absolute top-2 left-2 p-2 text-amber-600 hover:text-red-600 transition-colors">
						<BsArrowLeftShort className="w-9 h-9" />
					</Link>
					<h2 className="text-3xl text-center font-bold bg-gradient-to-r from-amber-500 to-red-500 bg-clip-text text-transparent ">
						Join a poll
					</h2>
					<div className="space-y-6">
						<InputField
							label="Enter Code Provided by Host"
							placeholder="Enter the code here"
							name="pollID"
							register={register}
							errors={errors}
						/>
						<div className="space-y-2">
							<InputField
								label="Enter Name"
								placeholder="Enter your name"
								name="name"
								register={register}
								errors={errors}
							/>
						</div>
					</div>
					<div className="pt-4">
						<button
							type="submit"
							className={`w-full py-3 px-4 text-base font-medium text-white bg-gradient-to-r from-amber-400 to-red-500 hover:from-amber-500 hover:to-red-600 rounded-md shadow-md hover:shadow-lg transition-all duration-300 pulsate-finite ${
								isPending
									? "opacity-50 cursor-not-allowed"
									: "opacity-100 cursor-pointer"
							}`}
							disabled={isPending}>
							Join
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default JoinPoll;
