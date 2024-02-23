import { Box, Button, Breadcrumb } from "@/components/common"
import MainLayout from "@/components/layouts/MainLayout"
import withAuth from "@/hoc/withAuth"
import { convertBase64, instance, parseContent } from "@/utils"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { useState } from "react"
import Swal from "sweetalert2"

const CustomEditor = dynamic(() => import("@/components/customEditor"), {
    ssr: false,
})

const Create = () => {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [featuredImage, setFeaturedImage] = useState("")
    const [content, setContent] = useState("")
    const [images, setImages] = useState<string[]>([])
    const [loading, setLoading] = useState(false)

    const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
    }

    const handleChangeDescription = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setDescription(e.target.value)
    }

    const handleUploadFeaturedImage = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (e.target.files) {
            const file = e.target.files[0]
            const base64image = await convertBase64(file)
            setFeaturedImage(base64image)
        }
    }

    const handleUploadImages = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (e.target.files) {
            const files = e.target.files
            const base64Images = await Promise.all(
                Array.from(files).map(async (file) => {
                    return await convertBase64(file)
                })
            )
            setImages([...images, ...base64Images])
        }
    }

    const validateData = (): boolean => {
        if (
            name.trim() === "" ||
            description.trim() === "" ||
            featuredImage === "" ||
            content.trim() === "" ||
            images.length === 0
        ) {
            return false
        }
        return true
    }

    const router = useRouter()
    const handlePublish = async () => {
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
        const newContent = await parseContent(content)
        instance
            .post("/projects", {
                name,
                description,
                featuredImage,
                content: newContent,
                images,
            })
            .then(() => {
                router.push("/projects")
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
            <Breadcrumb pageName="Dự án" link="/projects" />
            <Box className="max-w-230 m-auto">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">
                        Thêm dự án mới
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
                            placeholder="Tên dự án"
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
                            placeholder="Mô tả dự án"
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                    </div>
                    <div>
                        <label className="mb-3 block text-black dark:text-white">
                            Ảnh nổi bật
                        </label>
                        <input
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
                            Hình ảnh khác
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleUploadImages}
                            multiple
                            className="mb-3 w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                        />
                        <div className="flex gap-3">
                            {images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt="image"
                                    className="h-40 object-cover rounded-sm"
                                />
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="mb-3 block text-black dark:text-white">
                            Nội dung
                        </label>
                        <CustomEditor onEditorChange={setContent} />
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
        </MainLayout>
    )
}

export default withAuth(Create)
