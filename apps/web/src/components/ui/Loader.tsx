import classes from "../../styles/Loader.module.css";

type LoaderProps = {
	color: "blue" | "orange" | "purple";
	isLoading: boolean;
	width?: number;
};

const colorStyles = {
	blue: "bg-blue",
	orange: "bg-orange",
	purple: "bg-purple",
};

const Loader: React.FC<LoaderProps> = ({ color, isLoading, width = 80 }) => {
	return (
		<div className={`${classes.overlay} ${isLoading ? classes.active : ""}`}>
			<div className={`${classes.loading_wave}`}>
				<div className={`${classes.loading_bar} bg-color-bar`}></div>
				<div className={`${classes.loading_bar} bg-color-bar`}></div>
				<div className={`${classes.loading_bar} bg-color-bar`}></div>
				<div className={`${classes.loading_bar} bg-color-bar`}></div>
			</div>
		</div>
	);
};

export default Loader;
