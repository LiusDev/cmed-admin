import { Box, Button, Breadcrumb } from "@/components/common"
import MainLayout from "@/components/layouts/MainLayout"
import { TableSkeleton } from "@/components/skeletons"
import withAuth from "@/hoc/withAuth"
import { Category } from "@/types"
import { convertBase64, instance } from "@/utils"
import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"

const Create = () => {
    const [categories, setCategories] = useState<Category[] | null>(null)
    const [name, setName] = useState("")
    const [category, setCategory] = useState<Category["id"]>()
    const [description, setDescription] = useState("")
    const [featuredImage, setFeaturedImage] = useState("")
    const [document, setDocument] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)

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

    const handleChangeName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
    }, [])

    const handleChangeCategory = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setCategory(parseInt(e.target.value))
    }
        , [])
    const handleChangeDescription = useCallback((
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setDescription(e.target.value)
    }, [])

    const handleUploadFeaturedImage = useCallback(async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (e.target.files) {
            const file = e.target.files[0]
            const base64image = await convertBase64(file)
            setFeaturedImage(base64image)
        }
    }, [])

    const handleUploadDocument = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0]
            setDocument(file)
        }
    }, [])

    const router = useRouter()

    const handlePublish = useCallback(async () => {
        setLoading(true)
        instance
            .post(
                "/documents",
                {
                    name,
                    description,
                    featuredImage,
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
    }, [name, description, featuredImage, document, category])

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
                                title="featuredImage"
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
