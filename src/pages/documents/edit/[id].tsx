import { Box, Button, Breadcrumb } from "@/components/common"
import MainLayout from "@/components/layouts/MainLayout"
import { TableSkeleton } from "@/components/skeletons"
import withAuth from "@/hoc/withAuth"
import { Category, Document } from "@/types"
import { alias, instance, langOptions } from "@/utils"
import { SegmentedControl } from "@mantine/core"
import { useForm } from "@mantine/form"
import { useRouter } from "next/router"
import { useCallback, useEffect, useMemo, useState } from "react"
import ImageInput from "@/components/ImageInput"
import { TextInput } from "@/components/Text"
import { NumberInput } from "../../../components/NumberInput"

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
    const [document, setDocument] = useState<Document | null>(null)
    const [category, setCategory] = useState<Category["id"]>(1)
    const [documentUrl, setDocumentUrl] = useState<File | null>(null)
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
            .get(`/documents/${path}`)
            .then((res) => {
                form.setValues(res.data)
                setDocument(res.data)
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    window.location.href = "/signin"
                }
            })
    }, [])

    const handleChangeCategory = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setCategory(parseInt(e.target.value))
    }, [])



    const handleUploadDocument = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0]
            setDocumentUrl(file)
        }
    }, [])

    const router = useRouter()
    const handlePublish = async () => {
        setLoading(true)
        if (document) {
            instance
                .patch(
                    `/documents/${document.id}`,
                    {
                        ...form.values,
                        document: documentUrl,
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
        } else {
            setLoading(false)
        }
    }

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
                            Chỉnh sửa tài liệu
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
                                title="Danh mục"
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
                                title="Upload tài liệu"
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
                                Lưu
                            </Button>
                        </div>
                    </div>
                </Box>
            )}
        </MainLayout>
    )
}

export default withAuth(Create)
