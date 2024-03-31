import React from "react";

type Props = {
	onChange: any;
	value?: string;
	checked?: any;
	error?: any;
	onFocus?: any;
	onBlur?: any;
	title: string;
}

export const Text = (props: Props) => {
	return <div>
		<label className="mb-3 block text-black dark:text-white">
			{props.title}
		</label>
		<input
			value={props.value}
			onChange={props.onChange}
			type="text"
			placeholder={props.title}
			className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary" />
	</div>;
};
