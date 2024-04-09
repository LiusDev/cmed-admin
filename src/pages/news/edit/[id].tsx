import { Box, Breadcrumb, Button } from "@/components/common"
import MainLayout from "@/components/layouts/MainLayout"
import { TableSkeleton } from "@/components/skeletons"
import withAuth from "@/hoc/withAuth"
import type { Category, News } from "@/types"
import { alias, convertBase64, instance, langOptions, parseContent } from "@/utils"
import { SegmentedControl } from "@mantine/core"
import { useForm } from "@mantine/form"
import dynamic from "next/dynamic"
import React, { useEffect, useMemo, useState } from "react"
import Swal from "sweetalert2"
import { TextInput } from "../../../components/Text"
import ImageInput from "../../../components/ImageInput"

const CustomEditor = dynamic(() => import("@/components/customEditor"), {
    ssr: false,
})

const Edit = () => {
    const [lang, setLang] = useState<keyof typeof alias>("");
    const currentAlias = useMemo(() => alias[lang], [lang]);
    const [categories, setCategories] = useState<Category[]>([])
    const [category, setCategory] = useState<Category["id"]>(1)
    const [news, setNews] = useState<News | null>(null)
    const form = useForm({ initialValues: { title: "", titleJP: "", titleEN: "", description: "", descriptionEN: "", descriptionJP: "", featuredImage: "", content: "", contentJP: "", contentEN: "" } })
    const [loading, setLoading] = useState(false)

    let path: string
    useEffect(() => {
        path = window.location.pathname.split("/")[3]
        instance
            .get(`/categories`)
            .then((res) => {
                setCategories(res.data)
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    window.location.href = "/signin"
                }
            })
        instance
            .get(`/news/${path}`)
            .then((res) => {
                setNews(res.data)
                setCategory(res.data.category.id)
                delete res.data[category]
                form.setValues(res.data)
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    window.location.href = "/signin"
                }
            })
    }, [])


    const handleChangeCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCategory(parseInt(e.target.value))
    }

    const handlePublish = async () => {
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
        const [newContent, newContentEN, newContentJP] = await Promise.all([
            parseContent(form.values.content ?? ""),
            parseContent(form.values.contentEN ?? ""),
            parseContent(form.values.contentJP ?? "")
        ]);
        const body = {
            ...form.values,
            categoryId: category,
            content: newContent,
            contentEN: newContentEN,
            contentJP: newContentJP
        }
        if (news) {
            await instance
                .patch(`/news/${news.id}`, body)
                .then(() => {
                    window.location.href = "/news"
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
    }

    return (
        <MainLayout>
            <Breadcrumb pageName="Bài viết" link="/news" />
            {!news ? (
                <TableSkeleton
                    rows={4}
                    columns={1}
                    className="max-w-230 m-auto"
                />
            ) : (
                <Box className="max-w-230 m-auto">
                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            Chỉnh sửa bài viết
                        </h3>
                    </div>
                    <div className="flex flex-col gap-5.5 p-6.5">
                        <SegmentedControl disabled={loading} data={langOptions} value={lang} onChange={setLang as any} />
                        <TextInput title={`Tiều đề ${currentAlias}`} {...form.getInputProps(`title${lang}`)} />
                        <div className="col-span-2">
                            <label className="mb-3 block text-black dark:text-white">
                                Danh mục
                            </label>
                            <select
                                title="Danh mục"
                                onChange={handleChangeCategory}
                                value={category}
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            >
                                {categories.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <TextInput title={`Mô tả ${currentAlias}`} {...form.getInputProps(`description${lang}`)} />
                        <ImageInput title="Ảnh nổi bật" {...form.getInputProps("featuredImage")} />
                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Nội dung {currentAlias}
                            </label>
                            <div hidden={lang != ""}><CustomEditor {...form.getInputProps("content")} /></div>
                            <div hidden={lang != "EN"}><CustomEditor {...form.getInputProps("contentEN")} /></div>
                            <div hidden={lang != "JP"}><CustomEditor {...form.getInputProps("contentJP")} /></div>

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
