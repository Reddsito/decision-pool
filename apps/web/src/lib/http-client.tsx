import { ApiError } from "@/types/types";

const httpClient = async <T,>(
	url: string,
	options: RequestInit = {},
): Promise<T> => {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;

	const defaultOptions: RequestInit = {
		mode: "cors",
		headers: {
			"Content-Type": "application/json",
		},
	};

	const finalOptions: RequestInit = {
		...defaultOptions,
		...options,
		headers: {
			...defaultOptions.headers,
			...options.headers,
		},
	};

	try {
		const response = await fetch(`${baseURL}${url}`, finalOptions);

		if (!response.ok) {
			const errorData: ApiError = await response.json();
			if (errorData.message instanceof Array) {
				throw new Error(errorData.message[0]);
			}
			throw new Error(errorData.message || "Something went wrong");
		}

		return response.json() as Promise<T>;
	} catch (error) {
		throw error;
	}
};

export default httpClient;
