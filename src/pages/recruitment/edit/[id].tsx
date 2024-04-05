import { Box, Breadcrumb, Button } from "@/components/common"
import MainLayout from "@/components/layouts/MainLayout"
import { TableSkeleton } from "@/components/skeletons"
import withAuth from "@/hoc/withAuth"
import { instance, parseContent } from "@/utils"
import { DateTimePicker } from "@mantine/dates"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import React, { useCallback, useEffect, useState } from "react"
import Swal from "sweetalert2"

const CustomEditor = dynamic(() => import("@/components/customEditor"), {
    ssr: false,
})

const Edit = () => {
    const [mounted, setMounted] = useState(false)
    const [title, setTitle] = useState("")
    const [deadline, setDeadline] = useState<Date | null>(() => {
        const d = new Date()
        d.setHours(1)
        return d
    })
    const [content, setContent] = useState<string | undefined>("")
    const [loading, setLoading] = useState(false)

    let path: string
    useEffect(() => {
        path = window.location.pathname.split("/")[3]

        instance
            .get(`/recruitment/${path}`)
            .then((res) => {
                setTitle(res.data.title)
                setDeadline(new Date(res.data.deadline))
                setContent(res.data.content)
                setMounted(true)
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    window.location.href = "/signin"
                }
            })
    }, [])

    const handleChangeTitle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value)
    }, [])

    const validateData = useCallback((): boolean => {
        if (title.trim() === "" || deadline === null || content == null || content.trim() === "") {
            return false
        }
        return true
    }, [title, deadline, content])

    const router = useRouter()
    const handlePublish = useCallback(async () => {
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
        const newContent = await parseContent(content ?? "")

        await instance
            .patch(`/recruitment/${router.query.id}`, {
                title,
                deadline: deadline!.toISOString(),
                content: newContent,
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
    }, [title, deadline, content])

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
                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Tiêu đề
                            </label>
                            <input
                                value={title}
                                onChange={handleChangeTitle}
                                type="text"
                                placeholder="Tên dự án"
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            />
                        </div>

                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Hạn nộp hồ sơ
                            </label>
                            <DateTimePicker
                                placeholder="Chọn thời hạn"
                                monthsListFormat="mm"
                                locale="vn"
                                value={deadline}

                                onChange={setDeadline}
                            />
                        </div>
                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Nội dung
                            </label>
                            <CustomEditor
                                value={content}
                                onChange={setContent}
                            />
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
