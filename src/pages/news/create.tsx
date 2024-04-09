import { Box, Button, Breadcrumb } from "@/components/common"
import MainLayout from "@/components/layouts/MainLayout"
import { TableSkeleton } from "@/components/skeletons"
import withAuth from "@/hoc/withAuth"
import { Category } from "@/types"
import { alias, convertBase64, instance, langOptions, parseContent } from "@/utils"
import { useForm } from "@mantine/form"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { useEffect, useMemo, useState } from "react"
import Swal from "sweetalert2"
import { TextInput } from "../../components/Text"
import ImageInput from "../../components/ImageInput"
import { SegmentedControl } from "@mantine/core"

const CustomEditor = dynamic(() => import("@/components/customEditor"), {
    ssr: false,
})

const Create = () => {
    const [lang, setLang] = useState<keyof typeof alias>("");
    const currentAlias = useMemo(() => alias[lang], [lang]);
    const [categories, setCategories] = useState<Category[] | null>(null)
    const [category, setCategory] = useState<Category["id"]>()
    const [loading, setLoading] = useState(false)
    const form = useForm({
        initialValues: {
            title: "",
            titleJP: "",
            titleEN: "",
            description: "",
            descriptionJP: "",
            descriptionEN: "",
            featuredImage: "",
            content: "",
            contentJP: "",
            contentEN: ""
        }
    })
    useEffect(() => {
        instance
            .get(`/categories`)
            .then((res) => {
                setCategories(res.data)
                setCategory(res.data[0].id)
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

    const router = useRouter()

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
        const [newContent, newContentJP, newContentEN] = await Promise.all([
            parseContent(form.values.content ?? ""),
            parseContent(form.values.contentJP ?? ""),
            parseContent(form.values.contentEN ?? "")
        ]);
        instance
            .post("/news", {
                ...form.values,
                content: newContent,
                contentJP: newContentJP,
                contentEN: newContentEN,
                categoryId: category,
            })
            .then(() => {
                router.push("/news")
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    router.push("/signin")
                }
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return (
        <MainLayout>
            <Breadcrumb pageName="Bài viết" link="/news" />
            {!categories ? (
                <TableSkeleton
                    rows={4}
                    columns={1}
                    className="max-w-230 m-auto"
                />
            ) : (
                <Box className="max-w-230 m-auto">
                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            Tạo bài viết
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
                                title="Chọn danh mục"
                                onChange={handleChangeCategory}
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
                                className="w-full"
                                isLoading={loading}
                            >
                                Xuất bản
                            </Button>
                        </div>
                    </div>
                </Box>
            )}
        </MainLayout>
    )
}

export default withAuth(Create)
