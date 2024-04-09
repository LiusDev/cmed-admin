import { Box, Button, Breadcrumb } from "@/components/common"
import MainLayout from "@/components/layouts/MainLayout"
import { TableSkeleton } from "@/components/skeletons"
import withAuth from "@/hoc/withAuth"
import { Category } from "@/types"
import { alias, convertBase64, instance, langOptions } from "@/utils"
import { SegmentedControl } from "@mantine/core"
import { useForm } from "@mantine/form"
import { useRouter } from "next/router"
import { useCallback, useEffect, useMemo, useState } from "react"
import { TextInput } from "../../components/Text"
import { NumberInput } from "../../components/NumberInput"
import ImageInput from "../../components/ImageInput"

const Create = () => {
    const [lang, setLang] = useState<keyof typeof alias>("");
    const currentAlias = useMemo(() => alias[lang], [lang]);
    const form = useForm({
        initialValues: {
            name: "",
            nameJP: "",
            nameEN: "",
            description: "",
            descriptionJP: "",
            descriptionEN: "",
            categoryId: 0,
            view: 0,
            download: 0,
            featuredImage: "",
        }
    })
    const [categories, setCategories] = useState<Category[] | null>(null)
    const [category, setCategory] = useState<Category["id"]>()
    const [loading, setLoading] = useState(false)
    const [document, setDocument] = useState<File | null>(null)
    const handleUploadDocument = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0]
            setDocument(file)
        }
    }, [])

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



    const handleChangeCategory = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setCategory(parseInt(e.target.value))
    }
        , [])


    const router = useRouter()

    const handlePublish = useCallback(async () => {
        setLoading(true)
        instance
            .post(
                "/documents",
                {
                    ...form.values,
                    document,
                    categoryId: category,
                },
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            )
            .then(() => {
                router.push("/documents")
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    router.push("/signin")
                }
            })
            .finally(() => {
                setLoading(false)
            })
    }, [form, category, document])

    return (
        <MainLayout>
            <Breadcrumb pageName="Tài liệu" link="/documents" />
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
                            Thêm tài liệu mới
                        </h3>
                    </div>
                    <div className="flex flex-col gap-5.5 p-6.5">
                        <SegmentedControl disabled={loading} data={langOptions} value={lang} onChange={setLang as any} />
                        <TextInput title={`Tên nhân viên ${currentAlias}`} {...form.getInputProps(`name${lang}`)} />
                        <NumberInput title="Lượt xem" {...form.getInputProps("view")} />
                        <NumberInput title="Lượt tải xuống" {...form.getInputProps("download")} />

                        <div className="col-span-2">
                            <label className="mb-3 block text-black dark:text-white">
                                Danh mục
                            </label>
                            <select
                                title="category"
                                name="category"
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
                                Upload tài liệu
                            </label>
                            <input
                                title="document"
                                type="file"
                                accept="application/pdf"
                                onChange={handleUploadDocument}
                                className="mb-3 w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                            />
                        </div>
                        <div>
                            <Button
                                onClick={handlePublish}
                                color="success"
                                variant="rounded"
                                className="w-full"
                                isLoading={loading}
                            >
                                Thêm mới
                            </Button>
                        </div>
                    </div>
                </Box>
            )}
        </MainLayout>
    )
}

export default withAuth(Create)
