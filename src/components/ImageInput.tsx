import { ChangeEventHandler, useCallback } from "react"
import { convertBase64 } from "../utils"

export type Props = {
	title?: string
	value?: string
	onChange?: (value?:string)=>void
}

export default function (props: Props) {
	const handle = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const file = e.target.files[0]
			const base64Image = await convertBase64(file)
			props.onChange?.(base64Image)
		}
	}, [props.onChange])

	return <div>
		<label className="mb-3 block text-black dark:text-white">
			{props.title}
		</label>
		<input
			title={`Chọn ${props.title}`}
			type="file"
			accept="image/*"
			onChange={handle}
			className="mb-3 w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
		/>
		{props.value && (
			<img
				src={props.value}
				alt="featured image"
				className="h-40 object-cover rounded-sm"
			/>
		)}
	</div>
}