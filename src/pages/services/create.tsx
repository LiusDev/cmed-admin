import { Box, Button, Breadcrumb } from "@/components/common"
import MainLayout from "@/components/layouts/MainLayout"
import withAuth from "@/hoc/withAuth"
import { alias, convertBase64, instance, langOptions, parseContent } from "@/utils"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { useCallback, useMemo, useState } from "react"
import Swal from "sweetalert2"
import ImageInput from "../../components/ImageInput"
import { useInput } from "../../hooks/useInput"
import { useForm } from "@mantine/form"
import { SegmentedControl } from "@mantine/core"
import { TextInput } from "../../components/Text"

const CustomEditor = dynamic(() => import("@/components/customEditor"), {
    ssr: false,
})

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
            content: "",
            contentJP: "",
            contentEN: "",
            featuredImage: "",
            featuredImage2: "",
            logo: "",
        }
    })

    const [loading, setLoading] = useState(false)

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
        const [newContent, newContentEN, newContentJP] = await Promise.all([
            parseContent(form.values.content ?? ""),
            parseContent(form.values.contentEN ?? ""),
            parseContent(form.values.contentJP ?? ""),
        ]);


        instance
            .post("/services", {
                ...form.values,
                content: newContent,
                contentEN: newContentEN,
                contentJP: newContentJP,
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
                    <SegmentedControl disabled={loading} data={langOptions} value={lang} onChange={setLang as any} />
                    <TextInput title={`Tên dịch vụ ${currentAlias}`} {...form.getInputProps(`name${lang}`)} />
                    <TextInput title={`Mô tả ${currentAlias}`} {...form.getInputProps(`description${lang}`)} />
                    
                  
                    <ImageInput title="Logo" {...form.getInputProps("logo")} />
                    <ImageInput title="Ảnh nổi bật" {...form.getInputProps("featuredImage")} />
                    <ImageInput title="Nền ảnh nổi bật" {...form.getInputProps("featuredImage2")} />
                    
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
