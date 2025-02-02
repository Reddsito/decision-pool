type ConfirmationDialogProps = {
	message: string;
	showDialog: boolean;
	onCancel: () => void;
	onConfirm: () => void;
};

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
	message,
	showDialog,
	onCancel,
	onConfirm,
}) => {
	return showDialog ? (
		<div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center p-4">
			<div className="w-full max-w-sm bg-white rounded-lg shadow-xl p-6 animate-in fade-in zoom-in duration-200">
				<h2 className="text-2xl text-center text-gray-700 font-medium mb-8">
					{message}
				</h2>

				<div className="flex gap-3">
					<button
						className="flex-1 py-2.5 px-4 text-base font-medium border-2 box btn-orange rounded-lg transition-all duration-300 pulsate-finite"
						onClick={onCancel}>
						Cancel
					</button>

					<button
						className="flex-1 py-2.5 px-4 text-base font-medium text-white bg-gradient-to-r from-amber-400 to-red-500 hover:from-amber-500 hover:to-red-600 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 pulsate-finite"
						onClick={onConfirm}>
						Confirm
					</button>
				</div>
			</div>
		</div>
	) : null;
};

export default ConfirmationDialog;
