import { useForm } from '@mantine/form';
import { TextInput, Switch, Group, ActionIcon, Box, Text, Button, Code, Textarea, Flex, Card } from '@mantine/core';
import { TiTrash } from 'react-icons/ti';
import ImageInput from '../ImageInput';
import { useMemo, ForwardedRef, forwardRef, useImperativeHandle } from 'react';


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
		setValues: (data) => form.setValues({ data })
	}), [form])

	const fields = useMemo(() => form.values.data.map((item, index) => (
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
				<TextInput
					label='Tên tab'
					{...form.getInputProps(`data.${index}.title`)}
				/>
				<Textarea
					title='Nội dung'
					label="Nội dung"
					{...form.getInputProps(`data.${index}.content`)}
				/>
				<ImageInput {...form.getInputProps(`data.${index}.logo`)} />
				<ImageInput {...form.getInputProps(`data.${index}.featuredImage`)} />
				<ImageInput {...form.getInputProps(`data.${index}.featuredImage2`)} />
			</Card>
		</Flex>
	)), [form.values]);

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
						})
					}
				>
					Thêm nội dung
				</Button>
			</Group>
		</Box>
	);
})