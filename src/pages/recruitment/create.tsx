import { Box, Button, Breadcrumb } from "@/components/common"
import MainLayout from "@/components/layouts/MainLayout"
import withAuth from "@/hoc/withAuth"
import { instance, parseContent } from "@/utils"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { useState } from "react"
import Swal from "sweetalert2"
import { DatePickerInput } from "@mantine/dates"

const CustomEditor = dynamic(() => import("@/components/customEditor"), {
    ssr: false,
})

const Create = () => {
    const [title, setTitle] = useState("")
    const [deadline, setDeadline] = useState<Date | null>(new Date())
    const [content, setContent] = useState("")
    const [loading, setLoading] = useState(false)

    const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value)
    }

    const validateData = (): boolean => {
        if (title === "" || deadline === null || content === "") {
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
            .post("/recruitment", {
                title,
                deadline: deadline!.toISOString(),
                content: newContent,
            })
            .then(() => {
                router.push("/recruitment")
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
            <Breadcrumb pageName="Tuyển dụng" link="/recruitment" />
            <Box className="max-w-230 m-auto">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">
                        Thêm thông tin tuyển dụng
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
                        <DatePickerInput
                            placeholder="Pick date"
                            value={deadline}
                            onChange={setDeadline}
                        />
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
