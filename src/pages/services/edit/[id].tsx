import { Box, Breadcrumb, Button } from "@/components/common"
import MainLayout from "@/components/layouts/MainLayout"
import { TableSkeleton } from "@/components/skeletons"
import withAuth from "@/hoc/withAuth"
import type { Service } from "@/types"
import { alias, convertBase64, instance, langOptions, parseContent } from "@/utils"
import { SegmentedControl } from "@mantine/core"
import { useForm } from "@mantine/form"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import Swal from "sweetalert2"
import { TextInput } from "../../../components/Text"
import ImageInput from "../../../components/ImageInput"

const CustomEditor = dynamic(() => import("@/components/customEditor"), {
    ssr: false,
})

const Edit = () => {
    const router = useRouter()
    const [lang, setLang] = useState<keyof typeof alias>("");
    const currentAlias = useMemo(() => alias[lang], [lang]);
    const [service, setService] = useState<Service | null>(null)
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

    useEffect(() => {
        const path = router.query.id
        instance
            .get(`/services/${path}`)
            .then((res) => {
                setService(res.data)
                form.setValues(res.data)
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    window.location.href = "/signin"
                }
            })
    }, [router.query.id])


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

        const body = {
            ...form.values,
            content: newContent,
            contentEN: newContentEN,
            contentJP: newContentJP,
        }

        if (service) {
            await instance
                .patch(`/services/${service.id}`, body)
                .then(() => {
                    window.location.href = "/services"
                })
                .catch((err) => {
                    if (err.response.status === 401) {
                        window.location.href = "/signin"
                    }
                })
                .finally(() => {
                    setLoading(false)
                })
        } else {
            setLoading(false)
        }
    }, [service, form])

    return (
        <MainLayout>
            <Breadcrumb pageName="Dịch vụ" link="/services" />
            {!service ? (
                <TableSkeleton
                    rows={4}
                    columns={1}
                    className="max-w-230 m-auto"
                />
            ) : (
                <Box className="max-w-230 m-auto">
                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            Cập nhật dịch vụ
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
                                isLoading={loading}
                                className="w-full"
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

export default withAuth(Edit)
