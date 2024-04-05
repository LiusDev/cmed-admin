import { Box, Button, Breadcrumb } from "@/components/common"
import MainLayout from "@/components/layouts/MainLayout"
import { TableSkeleton } from "@/components/skeletons"
import withAuth from "@/hoc/withAuth"
import { Category, Document } from "@/types"
import { convertBase64, instance } from "@/utils"
import { NumberInput } from "@mantine/core"
import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"

const Create = () => {
    const [categories, setCategories] = useState<Category[] | null>(null)
    const [document, setDocument] = useState<Document | null>(null)
    const [name, setName] = useState("")
    const [category, setCategory] = useState<Category["id"]>(1)
    const [description, setDescription] = useState("")
    const [featuredImage, setFeaturedImage] = useState("")
    const [documentUrl, setDocumentUrl] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)

    const [view, setView] = useState(0)
    const [download, setDownload] = useState(0)

    const handleView = useCallback((value: string | number) => {
        if (typeof value === "string") {
            const numberValue = parseInt(value);
            setView(numberValue);
        }
        else if (typeof value === "number") {
            setView(value);
        }
    }, [])

    const handleDownload = useCallback((value: string | number) => {
        if (typeof value === "string") {
            const numberValue = parseInt(value);
            setDownload(numberValue);
        }
        else if (typeof value === "number") {
            setDownload(value);
        }
    }, [])

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
                setDocument(res.data)
                setName(res.data.name)
                setCategory(res.data.category.id)
                setDescription(res.data.description)
                setFeaturedImage(res.data.featuredImage)
                setDocumentUrl(res.data.documentUrl)
                setView(res.data.view)
                setDownload(res.data.download)
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    window.location.href = "/signin"
                }
            })
    }, [])

    const handleChangeName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
    }, [])

    const handleChangeCategory = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setCategory(parseInt(e.target.value))
    }, [])

    const handleChangeDescription = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(e.target.value)
    }, [])

    const handleUploadFeaturedImage = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0]
            const base64image = await convertBase64(file)
            setFeaturedImage(base64image)
        }
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
                        name,
                        description,
                        featuredImage,
                        document: documentUrl,
                        categoryId: category,
                        view, download
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
                        <div className="grid grid-cols-5 gap-2">
                            <div className="col-span-3">
                                <label className="mb-3 block text-black dark:text-white">
                                    Tên
                                </label>
                                <input
                                    value={name}
                                    onChange={handleChangeName}
                                    type="text"
                                    placeholder="Tên tài liệu"
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                            </div>
                            <div className="col-span-3">
                                <label className="mb-3 block text-black dark:text-white">
                                    Lượt xem
                                </label>
                                <NumberInput
                                    value={view}
                                    onChange={handleView}
                                    type="text"
                                    placeholder="Lượt xem"
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                            </div>
                            <div className="col-span-3">
                                <label className="mb-3 block text-black dark:text-white">
                                    Lượt tải xuống
                                </label>
                                <NumberInput
                                    value={download}
                                    onChange={handleDownload}
                                    type="text"
                                    placeholder="Lượt tải xuống"
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                            </div>
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
                        </div>
                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Mô tả
                            </label>
                            <input
                                value={description}
                                onChange={handleChangeDescription}
                                type="text"
                                placeholder="Mô tả tài liệu"
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            />
                        </div>
                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Ảnh nổi bật
                            </label>
                            <input
                                title="Ảnh nổi bật"
                                type="file"
                                accept="image/*"
                                onChange={handleUploadFeaturedImage}
                                className="mb-3 w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                            />
                            {featuredImage && (
                                <img
                                    src={featuredImage}
                                    alt="featured image"
                                    className="h-40 object-cover rounded-sm"
                                />
                            )}
                        </div>
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
