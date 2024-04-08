import { Box, Button, Breadcrumb } from "@/components/common"
import MainLayout from "@/components/layouts/MainLayout"
import withAuth from "@/hoc/withAuth"
import { } from "@/types"
import { alias, convertBase64, instance, langOptions } from "@/utils"
import { SegmentedControl } from "@mantine/core"
import { useForm } from "@mantine/form"
import { useRouter } from "next/router"
import { useCallback, useEffect, useMemo, useState } from "react"
import Swal from "sweetalert2"
import ImageInput from "../../components/ImageInput"
import { TextInput } from "../../components/Text"

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
            image: "",
            logo: "",
            icon: ""
        }
    })
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
            .post("/customers", form.values)
            .then(() => {
                router.push("/customers")
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

    return (
        <MainLayout>
            <Breadcrumb pageName="Khách hàng" link="/customers" />
            <Box className="max-w-230 m-auto">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">
                        Thêm khách hàng
                    </h3>
                </div>
                <div className="flex flex-col gap-5.5 p-6.5">
                    <SegmentedControl disabled={loading} data={langOptions} value={lang} onChange={setLang as any} />
                    <TextInput title={`Tên nhân viên ${currentAlias}`} {...form.getInputProps(`name${lang}`)} />
                    <ImageInput title="Logo" {...form.getInputProps("image")} />
                    <TextInput title={`Mô tả ${currentAlias}`} {...form.getInputProps(`description${lang}`)} />
                    <ImageInput title="Ảnh" {...form.getInputProps("image")} />
                    <ImageInput title="Logo" {...form.getInputProps("logo")} />
                    <ImageInput title="Icon" {...form.getInputProps("icon")} />
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
