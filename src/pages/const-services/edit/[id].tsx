import { Box, Breadcrumb, Button } from "@/components/common"
import MainLayout from "@/components/layouts/MainLayout"
import { TableSkeleton } from "@/components/skeletons"
import withAuth from "@/hoc/withAuth"
import type { Category, Service } from "@/types"
import { convertBase64, instance, parseContent } from "@/utils"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import React, { useCallback, useEffect, useState } from "react"
import Swal from "sweetalert2"
import { useInput } from "../../../hooks/useInput"
import ImageInput from "../../../components/ImageInput"
import { ComboboxData, NumberInput, Select, type ComboboxItem } from "@mantine/core"

const CustomEditor = dynamic(() => import("@/components/customEditor"), {
    ssr: false,
})

const Edit = () => {
    const router = useRouter()
    const [service, setService] = useState<Service | null>(null)
    const [name, setName, handleChangeName] = useInput("")
    const [title, setTitle, handleChangeTitle] = useInput("")
    const [description, setDescription, handleChangeDescription] = useInput("")
    const [featuredImage, setFeaturedImage] = useState<string | undefined>("")
    const [featuredImage2, setFeaturedImage2] = useState<string | undefined>("")
    const [logo, setLogo] = useState<string | undefined>("")
    const [content, setContent] = useState<string | undefined>("")
    const [loading, setLoading] = useState(false)
    const [index, setIndex] = useState(0)
    const [categoryId, setCategoryId] = useState<string | null>(null)


    const [options, setOptions] = useState<ComboboxItem[]>([])

    useEffect(() => {
        const path = router.query.id

        instance.get<Category[]>("/categories").then((res) => {
            const data = res.data.map((item: { id: number; name: string }) => ({
                value: item.id.toString(),
                label: item.name,
            } as ComboboxItem))
            setOptions(data)
        }).then(() => {
            instance
                .get(`/constservices/${path}`)
                .then((res) => {
                    setService(res.data)
                    setName(res.data.name)
                    setTitle(res.data.title)
                    setDescription(res.data.description)
                    setFeaturedImage(res.data.featuredImage)
                    setFeaturedImage2(res.data.featuredImage2)
                    setContent(res.data.content)
                    setLogo(res.data.logo)
                    if (res.data.category)
                        setCategoryId(String(res.data.category.id))
                })
                .catch((err) => {
                    if (err.response.status === 401) {
                        window.location.href = "/signin"
                    }
                })
        })
    }, [router.query.id])

    const validateData = useCallback((): boolean => {
        if (
            name.trim() === "" ||
            description.trim() === "" ||
            featuredImage === "" ||
            featuredImage2 === "" ||
            content == null ||
            content.trim() === "" ||
            title.trim() === "" ||
            logo == null
        ) {
            return false
        }
        return true
    }, [name, description, featuredImage, featuredImage2, content, logo, title])

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
        const newContent = await parseContent(content ?? "")
        const body = {
            name,
            description,
            featuredImage,
            featuredImage2,
            content: newContent,
            logo,
            title,
            index,
            categoryId,
        }

        if (service) {
            await instance
                .patch(`/constservices/${service.id}`, body)
                .then(() => {
                    window.location.href = "/const-services"
                })
                .catch((err) => {
                    if (err.response.status === 401) {
                        window.location.href = "/signin"
                    }
                })
                .finally(() => {
                    setLoading(false)
                })
        } else {
            setLoading(false)
        }
    }, [service, name, description, featuredImage, featuredImage2, content, logo, title, index, categoryId, validateData])

    return (
        <MainLayout>
            <Breadcrumb pageName="Dịch vụ" link="/const-services" />
            {!service ? (
                <TableSkeleton
                    rows={4}
                    columns={1}
                    className="max-w-230 m-auto"
                />
            ) : (
                <Box className="max-w-230 m-auto">
                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            Cập nhật dịch vụ
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
                                Thứ tự
                            </label>
                            <NumberInput
                                value={index}
                                onChange={v => {
                                    setIndex(Number(v))
                                }}
                                type="text"
                                placeholder="Tên dịch vụ"
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            />
                        </div>
                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Nhóm
                            </label>
                            <Select data={options} value={categoryId} onChange={setCategoryId} />
                        </div>
                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Tiêu đề
                            </label>
                            <input
                                value={title}
                                onChange={handleChangeTitle}
                                type="text"
                                placeholder="Tiêu đề dịch vụ"
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
                            <ImageInput title="Logo" value={logo} onChange={setLogo} />
                        </div>
                        <div>
                            <ImageInput title="Ảnh nội bật" value={featuredImage} onChange={setFeaturedImage} />
                        </div>
                        <div>
                            <ImageInput title="Ảnh nền sau ảnh nội bật" value={featuredImage2} onChange={setFeaturedImage2} />
                        </div>
                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Nội dung
                            </label>
                            <CustomEditor
                                value={content}
                                onChange={setContent}
                            />
                        </div>
                        <div>
                            <Button
                                onClick={handlePublish}
                                color="success"
                                variant="rounded"
                                isLoading={loading}
                                className="w-full"
                            >
                                Lưu
                            </Button>
                        </div>
                    </div>
                </Box>
            )}
        </MainLayout>
    )
}

export default withAuth(Edit)
