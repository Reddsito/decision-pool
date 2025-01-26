import { z } from "zod";

const pollSchema = z.object({
	pollTopic: z
		.string()
		.min(1, "Poll topic is required")
		.max(100, "Poll topic is too long"),
	votesPerParticipant: z.number().min(1).max(5),
	name: z.string().min(1, "Name is required").max(50, "Name is too long"),
});

export default pollSchema;
