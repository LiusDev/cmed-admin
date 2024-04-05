import { Box, Button, Breadcrumb } from "@/components/common"
import MainLayout from "@/components/layouts/MainLayout"
import { TableSkeleton } from "@/components/skeletons"
import withAuth from "@/hoc/withAuth"
import { Category } from "@/types"
import { convertBase64, instance, parseContent } from "@/utils"
import { Select, type ComboboxData, type ComboboxItem, NumberInput } from "@mantine/core"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { useCallback, useEffect, useRef, useState } from "react"
import Swal from "sweetalert2"
import ContentList, { type ContentListRef } from "../../../components/home-services/ContentList"
import { useParams } from "next/navigation"

const Edit = (props: any) => {

    const id = useParams()?.id as string ?? undefined

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState<ComboboxItem[]>([])
    const [index, setIndex] = useState(0)

    const [categoryId, setCategoryId] = useState<string | null>(null)
    const contentRef = useRef<ContentListRef>(null)
    const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
    }

    const handleChangeDescription = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setDescription(e.target.value)
    }

    const validateData = (): boolean => {
        if (
            name.trim() === "" ||
            description.trim() === ""
        ) {
            return false
        }
        return true
    }

    const router = useRouter()

    const handlePublish = useCallback(async () => {
        setLoading(true)
        if (!validateData()) {
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
                name,
                description,
                categoryId,
                index,
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
    }, [name, description, contentRef.current, categoryId, index, id])

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
                setName(data.name)
                setDescription(data.description)
                if (data.category)
                    setCategoryId(data.category.id.toString())
                setIndex(data.index)
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
                    <div>
                        <label className="mb-3 block text-black dark:text-white">
                            Tên
                        </label>
                        <input
                            value={name}
                            onChange={handleChangeName}
                            type="text"
                            placeholder="Tên dịch vụ"
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className="mb-3 block text-black dark:text-white">
                            Mô tả
                        </label>
                        <input
                            value={description}
                            onChange={handleChangeDescription}
                            type="text"
                            placeholder="Mô tả dịch vụ"
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className="mb-3 block text-black dark:text-white">
                            Thể loại tin tức
                        </label>
                        <Select placeholder="Chọn danh mục tin tức" data={categories} value={categoryId} onChange={v => {
                            setCategoryId(v)
                        }} />
                    </div>
                    <NumberInput value={index} onChange={v => {
                        if (typeof v === 'number') {
                            setIndex(v)
                        }
                    }} />
                    <div>
                        <label className="mb-3 block text-black dark:text-white">
                            Nội dung
                        </label>
                        <ContentList ref={contentRef} />
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
