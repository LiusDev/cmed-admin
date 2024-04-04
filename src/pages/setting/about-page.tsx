import { Box, Breadcrumb, Button as CustomButton } from "@/components/common"
import MainLayout from "@/components/layouts/MainLayout"
import { TableSkeleton } from "@/components/skeletons"
import withAuth from "@/hoc/withAuth"
import type { Staff, AboutPage, ElementOf } from "@/types"
import { convertBase64, instance } from "@/utils"
import dynamic from "next/dynamic"
import React, { ChangeEventHandler, forwardRef, useCallback, useEffect, useMemo, useState, type ForwardedRef, useImperativeHandle, useRef } from "react"
import Swal from "sweetalert2"
import { Text } from "@/components/Text"
import { useInput } from "@/hooks/useInput"
import ImageInput from "@/components/ImageInput"
import { useForm, type UseFormReturnType } from '@mantine/form';
import { Button, Divider, Flex, Group, Image, Modal, SegmentedControl, Skeleton, Table, TextInput, Textarea } from '@mantine/core';
const CustomEditor = dynamic(() => import("@/components/customEditor"), {
    ssr: false,
})
type Quotes2ModalRef = {
    open: (v: number) => void;
    close: () => void;
}
const Qutes2Modal = forwardRef((props: {
    form: UseFormReturnType<AboutPage, (values: AboutPage) => AboutPage>
}, ref: ForwardedRef<Quotes2ModalRef>) => {
    const [open, setOpen] = useState(false)
    const [index, setIndex] = useState<number>()

    const oldData = useMemo(() => {
        if (index != null)
            return props.form.values.quotes2[index]
        return undefined
    }, [index])

    const handleClose = useCallback(() => {
        if (index != null && oldData) {
            props.form.setFieldValue(`quotes2.${index}`, oldData)
            setOpen(false)
        }
    }, [index?.toString()])

    const handleSave = useCallback(() => {
        setOpen(false)
        setIndex(undefined)
    }, [])

    useImperativeHandle(ref, () => ({
        open: (v: number) => {
            setOpen(true)
            setIndex(v)
        },
        close: () => setOpen(false)
    }), [])
    return <Modal size={"50%"} yOffset={"200px"} opened={open} onClose={() => setOpen(false)}>
        <Flex direction={"column"} gap={"15px"}>
            <TextInput label="Tiêu đề" {...props.form.getInputProps(`quotes2.${index}.title`)} />
            <CustomEditor  data={props.form.getInputProps(`quotes2.${index}.content`).value} onChange={props.form.getInputProps(`quotes2.${index}.content`).onChange}  />
            <ImageInput title="Ảnh" {...props.form.getInputProps(`quotes2.${index}.image`)} />
            <Group>
                <Button color="green" onClick={handleSave}>Lưu</Button>
                <Button color="red" onClick={handleClose}>Đóng</Button>
            </Group>
        </Flex>
    </Modal>
})

const Quotes2Row = ({ value, onDelete, onEdit }: { value: ElementOf<AboutPage["quotes2"]>, onEdit: () => void, onDelete: () => void, onChange: (value?: ElementOf<AboutPage["quotes2"]>) => void }) => {
    return <Table.Tr>
        <Table.Td>{value.title}</Table.Td>
        <Table.Td>
            {value.content}
        </Table.Td>
        <Table.Td><Image src={value.image} /></Table.Td>
        <Table.Td>
            <Group justify="center">
                <Button variant="filled" color="green" onClick={onEdit}>Sửa</Button>
                <Button variant="filled" color="red" onClick={onDelete}>Xoá</Button>
            </Group>
        </Table.Td>
    </Table.Tr>
}

const Quotes2Table = (props: {
    onChange: (data: AboutPage["quotes2"]) => void;
    value?: AboutPage["quotes2"];
    checked?: any;
    error?: any;
    onFocus?: any;
    onBlur?: any;
    form: UseFormReturnType<AboutPage, (values: AboutPage) => AboutPage>,
}) => {

    const quote2Ref = useRef<Quotes2ModalRef>(null)

    const rows = useMemo(() => props.value?.map((d, i) => (
        <Quotes2Row key={i} value={d}
            onChange={(value) => {
            }}
            onEdit={() => {
                quote2Ref.current?.open(i)
            }}
            onDelete={() => {
                if (props.value) {
                    props.onChange(props.value.filter((_, index) => index !== i))
                }
            }} />
    )) ?? [], [props.value])

    return <Table>
        <Qutes2Modal form={props.form} ref={quote2Ref} />
        <Table.Thead>
            <Table.Tr>
                <Table.Th>Tên</Table.Th>
                <Table.Th>Nội dung</Table.Th>
                <Table.Th>Ảnh</Table.Th>
                <Table.Th>Chức năng</Table.Th>
            </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
    </Table>
}

const Edit = () => {
    const [lang, setLang] = useState("vi")
    const [loading, setLoading] = useState(true)

    const validate = useCallback((title: string) => (value: string) => {
        if (!value) {
            return `${title}: Nội dung không được để trống`
        }
    }, [])

    const formValidate = useMemo(() => ({
        title1: validate("Tiêu đề chính"),
        subtitle: validate("Tiêu đề phụ"),
        featuredImage: validate("Ảnh tiêu biểu"),
        quotesBackground: validate("Ảnh nền"),
        featuredButtonTitle: validate("Nội dung nút 1"),
        featuredButtonTitle2: validate("Nội dung nút 2"),
        tabTitle1: validate("Tiêu đề tab 1"),
        tabTitle2: validate("Tiêu đề tab 2"),
        tabTitle3: validate("Tiêu đề tab 3"),
        title2: validate("Tiêu đề 2"),
    }), [])

    const form = useForm<AboutPage>({
        initialValues: {
            title1: "",
            content2: [],
            quotes1: {
                content: "", author: "", background: ""
            },
            quotes2: [],
            subtitle: "",
            featuredImage: "",
            featuredButtonTitle: "",
            featuredButtonTitle2: "",
            tabTitle1: "",
            tabTitle2: "",
            tabTitle3: "",
            title2: "",
            image2: ""
        },
        validate: formValidate
    })

    const handle = useCallback(async (e: string) => {
        setLoading(true)
        setLang(e)
    }, [])

    useEffect(() => {
        (async () => {
            const { data: { content: data } } = await instance.get<{ content: AboutPage }>(`/setting/item/about/${lang}`)
            data.content2 = (data.content2 as string[]).map(i => {
                let text = i
                if (!i.startsWith("<p>"))
                    text = "<p>" + text

                if (!i.endsWith("</p>"))
                    text = text + "</p>"
                return text
            }).join("")
            form.setValues(data)
            setLoading(false)
        })()
    }, [lang])

    const submit = useCallback(() => {
        setLoading(true)
        const { content2, ...rest } = form.values
        const div = document.createElement("div")
        div.innerHTML = content2 as string
        const newContent2 = Array.from(div.children).filter(i => i.tagName === "P").map(i => i.innerHTML)
        instance.put(`/setting/about/${lang}`, { content2: newContent2, ...rest }).then(() => {
            setLoading(false)
            Swal.fire("Thành công", "Cập nhật thành công", "success")
        })
    }, [form])

    return (
        <MainLayout>
            <Breadcrumb pageName="Thiết lập trang về chúng tôi" link="/settings" />
            <Box className="max-w-230 m-auto">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">
                        Thiết lập trang "Về chúng tôi"
                    </h3>
                </div>
                <div className="flex flex-col gap-5.5 p-6.5">
                    <SegmentedControl disabled={loading} data={[{ label: "Tiếng Việt", value: 'vi' }, { label: 'Tiếng Anh', value: "en" }, { label: "Tiếng Nhật", value: 'jp' }]} value={lang} onChange={handle} />
                    <Skeleton visible={loading}>
                        <Text title="Tiêu đề chính" {...form.getInputProps("title1")} />
                        <Text title="Tiêu đề phụ" {...form.getInputProps("subtitle")} />
                        <ImageInput title="Ảnh tiêu biểu" {...form.getInputProps("featuredImage")} />
                        <Text title="Nội dung nút 1" {...form.getInputProps("featuredButtonTitle")} />
                        <Text title="Nội dung nút 2" {...form.getInputProps("featuredButtonTitle2")} />
                        <Divider my="md" />
                        <Text title="Tiêu đề tab 1" {...form.getInputProps("tabTitle1")} />
                        <Text title="Tiêu đề tab 2" {...form.getInputProps("tabTitle2")} />
                        <Text title="Tiêu đề tab 3" {...form.getInputProps("tabTitle3")} />
                        <Divider my="md" />
                        <Text title="Tiêu đề 2" {...form.getInputProps("title2")} />
                        <CustomEditor  data={form.getInputProps("content2").value}  onChange={form.getInputProps("content2").onChange} />
                        <ImageInput title="Ảnh 2" {...form.getInputProps("image2")} />
                        <Divider my="md" />
                        <Text title="Nội dung quote" {...form.getInputProps("quotes1.content")} />
                        <Text title="Tác giả quote" {...form.getInputProps("quotes1.author")} />
                        <ImageInput title="Ảnh nền quote" {...form.getInputProps("quotes1.background")} />
                        <Divider my="md" />
                        <Quotes2Table form={form} {...form.getInputProps("quotes2")} />
                    </Skeleton>
                    <div>
                        <CustomButton
                            onClick={() => {
                                submit()
                            }}
                            color="success"
                            variant="rounded"
                            isLoading={loading}
                            className="w-full"
                        >
                            Lưu
                        </CustomButton>
                    </div>
                </div>
            </Box>
        </MainLayout>
    )
}

export default withAuth(Edit)
