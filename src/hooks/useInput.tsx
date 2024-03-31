import React, { ChangeEventHandler, SetStateAction, useState } from "react";

export const useInput = (initialValue: string): [string, React.Dispatch<SetStateAction<string>>, ChangeEventHandler<HTMLInputElement>] => {
	const [value, setValue] = useState(initialValue);
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value);
	};
	return [value, setValue, handleChange];
};
