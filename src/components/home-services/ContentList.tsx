import { useForm } from '@mantine/form';
import { Switch, Group, ActionIcon, Box, Text, Button, Code, Textarea, Flex, Card, NumberInput } from '@mantine/core';
import { TiTrash } from 'react-icons/ti';
import ImageInput from '../ImageInput';
import { useMemo, ForwardedRef, forwardRef, useImperativeHandle } from 'react';
import dynamic from 'next/dynamic';
import { TextInput } from '../Text';

const CustomEditor = dynamic(() => import("@/components/customEditor"), {
	ssr: false,
})

export type ContentListRef = {
	getValues: () => ContentType[]
	setValues: (data: ContentType[]) => void
}

type ContentType = {
	title: string
	content: string
	featuredImage: string
	featuredImage2: string
	logo: string
}

export default forwardRef(function (props: {}, ref: ForwardedRef<ContentListRef>) {
	const form = useForm<{
		data: ContentType[]
	}>({
		initialValues: { data: [] },
	});

	useImperativeHandle(ref, () => ({
		getValues: () => form.values.data,
		setValues: (data) => {
			if (data)
				form.setValues({ data })
			else {
				form.setValues({ data: [] })
			}
		}
	}), [form])

	const fields = form.values.data.map((item, index) => (
		<Flex gap={15} direction={"column"} key={index} mt="xs">
			<Card shadow="sm" padding="lg" radius="md" withBorder>
				<Card.Section withBorder inheritPadding py="xs">
					<Group justify="space-between">
						<Text fw={500}>Nội dung của {form.values.data[index].title}</Text>
						<ActionIcon color="red" onClick={() => form.removeListItem('data', index)}>
							<TiTrash size="1rem" />
						</ActionIcon>
					</Group>
				</Card.Section>
				<Flex gap={15} direction={"column"}>
					<TextInput
						title='Tên tab'
						{...form.getInputProps(`data.${index}.title`)}
					/>
					<div>
						<label className="mb-3 block text-black dark:text-white">
							Thứ tự
						</label>
						<NumberInput {...form.getInputProps(`data.${index}.index`)} />
					</div>
					<div>
						<label className="mb-3 block text-black dark:text-white">
							Nội dung
						</label>
						<CustomEditor
							{...form.getInputProps(`data.${index}.content`)}
						/>
					</div>
					<div>
						<label className="mb-3 block text-black dark:text-white">
							Logo
						</label>
						<ImageInput {...form.getInputProps(`data.${index}.logo`)} />

					</div>
					<div>
						<label className="mb-3 block text-black dark:text-white">
							Ảnh tiêu biểu
						</label>
						<ImageInput {...form.getInputProps(`data.${index}.featuredImage`)} />

					</div>
					<div>
						<label className="mb-3 block text-black dark:text-white">
							Ảnh sau ảnh tiêu biểu
						</label>
						<ImageInput {...form.getInputProps(`data.${index}.featuredImage2`)} />

					</div>
				</Flex>
			</Card>
		</Flex>
	))

	return (
		<Box mx="auto">
			{fields.length > 0 ? (
				<></>
			) : (
				<Text c="dimmed" ta="center">
					Không có nội dung..
				</Text>
			)}

			{fields}

			<Group justify="center" mt="md">
				<Button
					onClick={() =>
						form.insertListItem("data", {
							title: "",
							content: "",
							logo: "",
							index: 0,
						})
					}
				>
					Thêm nội dung
				</Button>
			</Group>
		</Box>
	);
})