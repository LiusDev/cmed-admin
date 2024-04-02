import { Box, Button, Breadcrumb } from "@/components/common"
import MainLayout from "@/components/layouts/MainLayout"
import withAuth from "@/hoc/withAuth"
import { convertBase64, instance, parseContent } from "@/utils"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { useCallback, useState } from "react"
import Swal from "sweetalert2"
import ImageInput from "../../components/ImageInput"
import { useInput } from "../../hooks/useInput"

const CustomEditor = dynamic(() => import("@/components/customEditor"), {
    ssr: false,
})

const Create = () => {
    const [name, setName] = useState("")
    const [description, _setDescription, handleChangeDescription] = useInput("")
    const [featuredImage, setFeaturedImage] = useState("")
    const [featuredImage2, setFeaturedImage2] = useState("")
    const [content, setContent] = useState("")
    const [loading, setLoading] = useState(false)
    const [logo, setLogo] = useState("")

    const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
    }

    const handleUploadFeaturedImage = useCallback(async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (e.target.files) {
            const file = e.target.files[0]
            const base64Image = await convertBase64(file)
            setFeaturedImage(base64Image)
        }
    }, [])

    const handleUploadFeaturedImage2 = useCallback(async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (e.target.files) {
            const file = e.target.files[0]
            const base64Image = await convertBase64(file)
            setFeaturedImage2(base64Image)
        }
    }, [])

    const validateData = (): boolean => {
        if (
            name.trim() === "" ||
            description.trim() === "" ||
            featuredImage === "" ||
            featuredImage2 === "" ||
            content.trim() === "" ||
            logo.trim() === ""
        ) {
            return false
        }
        return true
    }

    const handleLogo = useCallback((v?: string) => {
        if (v) {
            setLogo(v)
        }
    }, [])

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
            .post("/services", {
                name,
                description,
                featuredImage,
                featuredImage2,
                logo,
                content: newContent,
            })
            .then(() => {
                router.push("/services")
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
            <Breadcrumb pageName="Dịch vụ" link="/services" />
            <Box className="max-w-230 m-auto">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">
                        Thêm dịch vụ mới
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
                    <ImageInput title="Logo" value={logo} onChange={handleLogo} />
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
                            Ảnh nền nổi bật
                        </label>
                        <input
                            title="Ảnh nền nổi bật"
                            type="file"
                            accept="image/*"
                            onChange={handleUploadFeaturedImage2}
                            className="mb-3 w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                        />
                        {featuredImage && (
                            <img
                                src={featuredImage2}
                                alt="featured image"
                                className="h-40 object-cover rounded-sm"
                            />
                        )}
                    </div>
                    <div>
                        <label className="mb-3 block text-black dark:text-white">
                            Nội dung
                        </label>
                        <CustomEditor onChange={setContent} />
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
