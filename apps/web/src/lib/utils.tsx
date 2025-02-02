import { JSX } from "react";

export const colorizeText = (text: string): JSX.Element[] =>
	text.split("").map((val, index) => {
		return val.charCodeAt(0) >= 48 && val.charCodeAt(0) <= 57 ? (
			<span
				key={index}
				className="text-red-700">
				{val}
			</span>
		) : (
			<span
				key={index}
				className="text-orange-600">
				{val}
			</span>
		);
	});

type TokenPayload = {
	iat: number;
	exp: number;
	sub: string;
	name: string;
	pollID: string;
};

export const getTokenPayload = (accessToken: string): TokenPayload =>
	JSON.parse(atob(accessToken.split(".")[1]));
