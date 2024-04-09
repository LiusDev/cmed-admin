import { useForm } from '@mantine/form';
import { Switch, Group, ActionIcon, Box, Text, Button, Code, Textarea, Flex, Card } from '@mantine/core';
import { TiTrash } from 'react-icons/ti';
import ImageInput from '../ImageInput';
import { useMemo, ForwardedRef, forwardRef, useImperativeHandle } from 'react';
import dynamic from 'next/dynamic';
import { TextInput } from '../Text';
import { alias } from '../../utils';
import { NumberInput } from '../NumberInput';
import { title } from 'process';

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

export default forwardRef(function ({ lang }: { lang: keyof typeof alias }, ref: ForwardedRef<ContentListRef>) {
	const currentAlias = useMemo(() => alias[lang], [lang]);

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
						title={`Tên tab ${currentAlias}`}
						{...form.getInputProps(`data.${index}.title${lang}`)}
					/>

					<NumberInput title='Thứ tự' {...form.getInputProps(`data.${index}.index`)} />

					<div>
						<label className="mb-3 block text-black dark:text-white">
							Nội dung {currentAlias}
						</label>
						<div hidden={lang != ""}><CustomEditor {...form.getInputProps(`data.${index}.content`)} /></div>
						<div hidden={lang != "EN"}><CustomEditor {...form.getInputProps(`data.${index}.contentEN`)} /></div>
						<div hidden={lang != "JP"}><CustomEditor {...form.getInputProps(`data.${index}.contentJP`)} /></div>
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
							titleEN: "",
							titleJP: "",
							content: "",
							contentEN: "",
							contentJP: "",
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