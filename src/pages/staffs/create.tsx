import { Box, Button, Breadcrumb } from "@/components/common"
import MainLayout from "@/components/layouts/MainLayout"
import withAuth from "@/hoc/withAuth"
import { alias, convertBase64, instance, langOptions } from "@/utils"
import { SegmentedControl } from "@mantine/core"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { useCallback, useMemo, useState } from "react"
import Swal from "sweetalert2"
import { useInput } from "../../hooks/useInput"
import { useForm } from "@mantine/form"
import ImageInput from "../../components/ImageInput"
import { TextInput } from "../../components/Text"

const CustomEditor = dynamic(() => import("@/components/customEditor"), {
    ssr: false,
})

const Create = () => {
    const [lang, setLang] = useState<keyof typeof alias>('')
    const form = useForm({
        initialValues: {
            name: "",
            nameEN: "",
            nameJP: "",
            position: "",
            positionEN: "",
            positionJP: "",
            description: "",
            descriptionEN: "",
            descriptionJP: "",
            featuredImage: "",
        },
    }
    )
    const [loading, setLoading] = useState(false)




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
        instance
            .post("/staffs", form.values)
            .then(() => {
                router.push("/staffs")
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    router.push("/signin")
                }
            })
            .finally(() => {
                setLoading(false)
            })
    }, [form])

    const currentAlias = useMemo(() => alias[lang], [lang])

    return (
        <MainLayout>
            <Breadcrumb pageName="Nhân viên" link="/staffs" />
            <Box className="max-w-230 m-auto">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">
                        Thêm nhân viên
                    </h3>
                </div>
                <div className="flex flex-col gap-5.5 p-6.5">
                    <SegmentedControl disabled={loading} data={langOptions} value={lang} onChange={setLang as any} />
                    <TextInput title={`Tên nhân viên ${currentAlias}`} {...form.getInputProps(`name${lang}`)} />
                    <TextInput title={`Vị trí ${currentAlias}`} {...form.getInputProps(`position${lang}`)} />
                    <div>
                        <label className="mb-3 block text-black dark:text-white">
                            Mô tả {currentAlias}
                        </label>
                        <div hidden={lang != ''}>
                                <CustomEditor {...form.getInputProps(`description`)} />
                            </div>
                            <div hidden={lang != 'JP'}>
                                <CustomEditor {...form.getInputProps(`descriptionJP`)} />
                            </div>
                            <div hidden={lang != 'EN'}>
                                <CustomEditor {...form.getInputProps(`descriptionEN`)} />
                            </div>
                    </div>
                    <ImageInput title="Ảnh nội bật" {...form.getInputProps("featuredImage")} />
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
        </MainLayout>
    )
}

export default withAuth(Create)
