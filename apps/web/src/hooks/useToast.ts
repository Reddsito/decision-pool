import { toast, Zoom } from "react-toastify";

const toastConfig = {
	position: "top-right" as const,
	autoClose: 3000,
	hideProgressBar: false,
	closeOnClick: true,
	pauseOnHover: false,
	draggable: true,
	theme: "light" as const,
	transition: Zoom,
};

export const showSuccessToast = (message: string) => {
	toast.success(message, toastConfig);
};

export const showErrorToast = (error: Error | string) => {
	const errorMessage = error instanceof Error ? error.message : error;
	toast.error(errorMessage, toastConfig);
};
