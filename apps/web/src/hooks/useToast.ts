import { use } from "react";
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

const useToast = () => {
	return { showSuccessToast, showErrorToast };
};

const showSuccessToast = (message: string) => {
	toast.success(message, toastConfig);
};

const showErrorToast = (error: Error | string) => {
	const errorMessage = error instanceof Error ? error.message : error;
	toast.error(errorMessage, toastConfig);
};

export default useToast;
