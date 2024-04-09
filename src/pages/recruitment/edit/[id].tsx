import { Box, Breadcrumb, Button } from "@/components/common"
import MainLayout from "@/components/layouts/MainLayout"
import { TableSkeleton } from "@/components/skeletons"
import withAuth from "@/hoc/withAuth"
import { alias, instance, langOptions, parseContent } from "@/utils"
import { SegmentedControl } from "@mantine/core"
import { DateTimePicker } from "@mantine/dates"
import { useForm } from "@mantine/form"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import Swal from "sweetalert2"
import { TextInput } from "../../../components/Text"

const CustomEditor = dynamic(() => import("@/components/customEditor"), {
    ssr: false,
})

const Edit = () => {
    const [mounted, setMounted] = useState(false)
    const [deadline, setDeadline] = useState<Date | null>(() => {
        const d = new Date()
        d.setHours(1)
        return d
    })
    const [loading, setLoading] = useState(false)
    const [lang, setLang] = useState<keyof typeof alias>("");
    const currentAlias = useMemo(() => alias[lang], [lang]);

    const form = useForm({
        initialValues: {
            title: "",
            titleJP: "",
            titleEN: "",
            content: "",
            contentJP: "",
            contentEN: "",
        }
    })


    let path: string
    useEffect(() => {
        path = window.location.pathname.split("/")[3]

        instance
            .get(`/recruitment/${path}`)
            .then((res) => {
                form.setValues(res.data)
                setDeadline(new Date(res.data.deadline))
                setMounted(true)
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    window.location.href = "/signin"
                }
            })
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

        await instance
            .patch(`/recruitment/${router.query.id}`, {
                ...form.values,
                deadline: deadline!.toISOString(),
                content: newContent,
                contentEN: newContentEN,
                contentJP: newContentJP,
            })
            .then(() => {
                window.location.href = "/recruitment"
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    window.location.href = "/signin"
                }
            })
            .finally(() => {
                setLoading(false)
            })
    }, [form, deadline])

    return (
        <MainLayout>
            <Breadcrumb pageName="Tuyển dụng" link="/recruitment" />
            {!mounted ? (
                <TableSkeleton
                    rows={4}
                    columns={1}
                    className="max-w-230 m-auto"
                />
            ) : (
                <Box className="max-w-230 m-auto">
                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            Cập nhật thông tin tuyển dụng
                        </h3>
                    </div>
                    <div className="flex flex-col gap-5.5 p-6.5">
                        <SegmentedControl disabled={loading} data={langOptions} value={lang} onChange={setLang as any} />
                        <TextInput title={`Tiêu đề ${currentAlias}`} {...form.getInputProps(`title${lang}`)} />

                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Hạn nộp hồ sơ
                            </label>
                            <DateTimePicker
                                placeholder="Pick date"
                                value={deadline}
                                onChange={setDeadline}
                            />
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
