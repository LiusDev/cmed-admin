import { Box, Button, Breadcrumb } from "@/components/common"
import MainLayout from "@/components/layouts/MainLayout"
import withAuth from "@/hoc/withAuth"
import { alias, convertBase64, instance, langOptions, parseContent } from "@/utils"
import { SegmentedControl } from "@mantine/core"
import { useForm } from "@mantine/form"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { useCallback, useMemo, useState } from "react"
import Swal from "sweetalert2"
import { TextInput } from "../../components/Text"
import ImageInput from "../../components/ImageInput"

const CustomEditor = dynamic(() => import("@/components/customEditor"), {
    ssr: false,
})

const Create = () => {
    const [featuredImage, setFeaturedImage] = useState("")
    const [images, setImages] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [lang, setLang] = useState<keyof typeof alias>("");
    const currentAlias = useMemo(() => alias[lang], [lang]);

    const form = useForm({
        initialValues: {
            name: "",
            nameJP: "",
            nameEN: "",
            subtitle: "",
            subtitleJP: "",
            subtitleEN: "",
            content: "",
            contentJP: "",
            contentEN: "",
            description: "",
            descriptionJP: "",
            descriptionEN: "",
            featuredImage: "",
        }
    })

    const handleUploadImages = useCallback(async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (e.target.files) {
            const files = e.target.files
            const base64Images = await Promise.all(
                Array.from(files).map(async (file) => {
                    return await convertBase64(file)
                })
            )
            setImages([...base64Images])
        }
    }, [])

    const router = useRouter()
    const handlePublish = useCallback(async () => {
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
            parseContent(form.values.contentJP ?? ""),
        ]);

        instance
            .post("/projects", {
                ...form.values,
                featuredImage,
                images,
                content: newContent,
                contentEN: newContentEN,
                contentJP: newContentJP,
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
    }, [name, , featuredImage, images, router])

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
                    <SegmentedControl disabled={loading} data={langOptions} value={lang} onChange={setLang as any} />
                    <TextInput title={`Tiêu đề ${currentAlias}`} {...form.getInputProps(`name${lang}`)} />
                    <TextInput title={`Tiêu đề phụ ${currentAlias}`} {...form.getInputProps(`subtitle${lang}`)} />
                    <TextInput title={`Mô tả ${currentAlias}`} {...form.getInputProps(`description${lang}`)} />
                    <ImageInput title="Ảnh nổi bật" {...form.getInputProps("featuredImage")} />

                    <div>
                        <label className="mb-3 block text-black dark:text-white">
                            Hình ảnh khác
                        </label>
                        <input
                            title="images"
                            type="file"
                            accept="image/*"
                            onChange={handleUploadImages}
                            multiple
                            className="mb-3 w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                        />
                        <div className="flex gap-3 flex-wrap">
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
                            Nội dung {currentAlias}
                        </label>
                        <div hidden={lang != ""}><CustomEditor {...form.getInputProps(`content`)} /></div>
                        <div hidden={lang != "EN"}><CustomEditor {...form.getInputProps(`contentEN`)} /></div>
                        <div hidden={lang != "JP"}><CustomEditor {...form.getInputProps(`contentJP`)} /></div>
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
