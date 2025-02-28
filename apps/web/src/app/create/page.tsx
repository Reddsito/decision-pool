"use client";
import InputField from "../../components/InputField";
import Label from "../../components/Label";
import CountSelector from "../../components/ui/CounterSelector";
import { Link, useTransitionRouter } from "next-transition-router";
import { BsArrowLeftShort } from "react-icons/bs";
import { createPollSchema } from "@/schemas/pollSchema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import usePoll from "@/hooks/usePolls";
import useAppStore from "@/stores/useAppStore";
import { useEffect } from "react";
import { BiChevronLeft } from "react-icons/bi";

const CreatePoll = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		control,
	} = useForm({
		resolver: zodResolver(createPollSchema),
		defaultValues: {
			votesPerParticipant: 1,
		},
	});

	const {
		useCreatePoll: { mutate, isPending },
	} = usePoll();
	const startLoading = useAppStore((state) => state.startLoading);
	const hasVoted = useAppStore((state) => state.hasVoted);

	const onSubmit = (data: any) => {
		startLoading();
		mutate({
			name: data.name,
			votesPerVoter: data.votesPerParticipant,
			topic: data.pollTopic,
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

		if (me()?.id && hasVoted()) {
			router.push("/results");
		}
	}, [me()?.id, poll?.hasStarted, hasVoted()]);

	return (
		<div className="flex flex-col w-full justify-around items-stretch h-full mx-auto max-w-md">
			<div className=" flex flex-col justify-center relative bg-white/80 p-6 rounded-lg shadow-lg box-border backdrop-blur ">
				<form
					className="space-y-4"
					onSubmit={handleSubmit(onSubmit)}>
					<Link
						className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-red-500 hover:from-amber-500 hover:to-red-600 text-white transition-colors absolute top-4 left-4"
						aria-label="Go back"
						href={"/"}>
						<BiChevronLeft className="w-6 h-6" />
					</Link>
					<h2 className="text-3xl text-center font-bold bg-gradient-to-r from-amber-500 to-red-500 bg-clip-text text-transparent ">
						Create a Poll
					</h2>
					<div className="space-y-6">
						<InputField
							label="Enter Poll Topic"
							placeholder="Type your poll topic here"
							name="pollTopic"
							register={register}
							errors={errors}
						/>
						<div className="space-y-2">
							<Label label="Votes Per Participant" />
							<Controller
								name="votesPerParticipant"
								control={control}
								render={({ field }) => (
									<CountSelector
										min={1}
										max={5}
										initial={field.value}
										step={1}
										onChange={(value) => field.onChange(value)}
									/>
								)}
							/>
							{errors.votesPerParticipant && (
								<p className="text-red-500">
									{errors.votesPerParticipant.message?.toString()}
								</p>
							)}
						</div>
						<InputField
							label="Enter Name"
							placeholder="Enter your name"
							name="name"
							register={register}
							errors={errors}
						/>
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
							Create
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default CreatePoll;
