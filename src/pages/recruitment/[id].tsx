import { Box, Breadcrumb, Button } from "@/components/common"
import MainLayout from "@/components/layouts/MainLayout"
import type { Recruitment } from "@/types"
import { convertDate, instance } from "@/utils"
import { useRouter } from "next/router"
import parse from "html-react-parser"
import { useEffect, useState } from "react"
import { TableSkeleton } from "@/components/skeletons"
import withAuth from "@/hoc/withAuth"

const Recruitment = () => {
    const [mounted, setMounted] = useState(false)
    const [recruitment, setRecruitment] = useState<Recruitment | null>(null)
    let path: string
    const router = useRouter()
    useEffect(() => {
        path = window.location.pathname.split("/")[2]
        instance
            .get(`/recruitment/${path}`)
            .then((res) => {
                setMounted(true)
                setRecruitment(res.data)
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    window.location.href = "/signin"
                }
            })
    }, [])

    return (
        <MainLayout>
            <Breadcrumb pageName="Tuyển dụng" link="/recruitment">
                <Button
                    color="success"
                    variant="rounded"
                    size="large"
                    href={`/recruitment/edit/${router.query.id}`}
                >
                    Chỉnh sửa
                </Button>
            </Breadcrumb>
            {!recruitment ? (
                <TableSkeleton
                    rows={1}
                    columns={1}
                    className="max-w-230 m-auto"
                />
            ) : (
                <Box className="max-w-230 m-auto">
                    <div className="flex flex-col gap-5.5 p-6.5">
                        <div>
                            <h2 className="text-4xl font-semibold text-black dark:text-white mb-2">
                                {recruitment.title}
                            </h2>
                            <p>{convertDate(recruitment.createdAt)}</p>
                            <p>Hạn nộp: {convertDate(recruitment.deadline)}</p>
                        </div>
                        <div>{mounted && parse(recruitment.content)}</div>
                    </div>
                </Box>
            )}
        </MainLayout>
    )
}

export default withAuth(Recruitment)
