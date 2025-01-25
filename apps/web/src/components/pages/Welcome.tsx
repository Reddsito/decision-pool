"use client";

const WelcomePage = () => {
	return (
		<div className="flex flex-col justify-center items-center h-full">
			<h1 className="text-center my-12">Welcome to Decision Pool</h1>
			<div className="my-12 flex flex-col justify-center">
				<button
					className="box btn-orange my-2"
					onClick={() => console.log("Go to create pool")}>
					Create New Pool
				</button>
			</div>
		</div>
	);
};

export default WelcomePage;
