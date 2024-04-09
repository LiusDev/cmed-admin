import { Box, Button, Breadcrumb } from "@/components/common"
import MainLayout from "@/components/layouts/MainLayout"
import { TableSkeleton } from "@/components/skeletons"
import withAuth from "@/hoc/withAuth"
import { Category } from "@/types"
import { alias, convertBase64, instance, langOptions, parseContent } from "@/utils"
import { Select, type ComboboxData, type ComboboxItem, SegmentedControl } from "@mantine/core"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Swal from "sweetalert2"
import ContentList, { type ContentListRef } from "../../../components/home-services/ContentList"
import { useParams } from "next/navigation"
import { useForm } from "@mantine/form"
import { TextInput } from "../../../components/Text"
import { NumberInput } from "../../../components/NumberInput"

const Edit = (props: any) => {

    const id = useParams()?.id as string ?? undefined
    const [lang, setLang] = useState<keyof typeof alias>("");
    const currentAlias = useMemo(() => alias[lang], [lang]);
    const form = useForm({
        initialValues: {
            name: "",
            nameEN: "",
            nameJP: "",
            description: "",
            descriptionJP: "",
            descriptionEN: "",
            index: 0,
        }
    })
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState<ComboboxItem[]>([])
    const [categoryId, setCategoryId] = useState<string | null>(null)
    const contentRef = useRef<ContentListRef>(null)


    const router = useRouter()

    const handlePublish = useCallback(async () => {
        setLoading(true)
        if (form.validate().hasErrors) {
            setLoading(false)
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: "Vui lòng điền đầy đủ thông tin!",
            })
            return
        }

        instance
            .put(`/service2/${id}`, {
                ...form.values,
                categoryId,
                content: contentRef.current?.getValues() ?? []
            })
            .then(() => {
                router.push("/service2/")
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    router.push("/signin")
                }
            })
            .finally(() => {
                setLoading(false)
            })
    }, [contentRef.current, categoryId, form, id])

    useEffect(() => {
        instance.get<Category[]>('/categories').then(res => {
            setCategories(res.data.map(item => ({
                value: item.id.toString(), label: item.name
            } as ComboboxItem)))
        })
    }, [])

    useEffect(() => {
        if (id != null) {
            instance.get(`/service2/${id}`).then(res => {
                const data = res.data
                form.setValues(data)
                if (data.category)
                    setCategoryId(data.category.id.toString())
                contentRef.current?.setValues(data.content ?? [])
            })
        }
    }, [id])

    return (
        <MainLayout>
            <Breadcrumb pageName="Cập nhật dịch vụ trang chủ" link="/service2" />
            <Box className="max-w-230 m-auto">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">
                        Cập nhật dịch vụ trang chủ
                    </h3>
                </div>
                <div className="flex flex-col gap-5.5 p-6.5">
                    <SegmentedControl disabled={loading} data={langOptions} value={lang} onChange={setLang as any} />
                    <TextInput title={`Tên dịch vụ ${currentAlias}`} {...form.getInputProps(`name${lang}`)} />
                    <TextInput title={`Mô tả ${currentAlias}`} {...form.getInputProps(`description${lang}`)} />
                    <div>
                        <label className="mb-3 block text-black dark:text-white">
                            Thể loại tin tức
                        </label>
                        <Select placeholder="Chọn danh mục tin tức" data={categories} value={categoryId} onChange={v => {
                            setCategoryId(v)
                        }} />
                    </div>
                    <NumberInput title="Thứ tự" {...form.getInputProps("index")} />
                    <div>
                        <label className="mb-3 block text-black dark:text-white">
                            Nội dung
                        </label>
                        <ContentList lang={lang} ref={contentRef} />
                    </div>
                    <div>
                        <Button
                            onClick={handlePublish}
                            color="success"
                            variant="rounded"
                            className="w-full"
                            isLoading={loading}
                        >
                            Lưu
                        </Button>
                    </div>
                </div>
            </Box>
        </MainLayout>
    )
}

export default withAuth(Edit)
