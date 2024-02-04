import { Box, Breadcrumb, Button } from "@/components/common"
import MainLayout from "@/components/layouts/MainLayout"
import type { Document } from "@/types"
import { convertDate, instance } from "@/utils"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { TableSkeleton } from "@/components/skeletons"
import withAuth from "@/hoc/withAuth"
import PdfViewer from "@/components/pdfViewer/PdfViewer"

const Documents = () => {
    const [mounted, setMounted] = useState(false)
    const [document, setDocument] = useState<Document | null>(null)
    let path: string
    const router = useRouter()
    useEffect(() => {
        path = window.location.pathname.split("/")[2]
        instance
            .get(`/documents/${path}`)
            .then((res) => {
                setMounted(true)
                setDocument(res.data)
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    window.location.href = "/signin"
                }
            })
    }, [])

    return (
        <MainLayout>
            <Breadcrumb pageName="Tài liệu" link="/documents">
                <Button
                    color="success"
                    variant="rounded"
                    size="large"
                    href={`/documents/edit/${router.query.id}`}
                >
                    Chỉnh sửa
                </Button>
            </Breadcrumb>
            {!document ? (
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
                                {document.name}
                            </h2>
                            <p>{convertDate(document.createdAt)}</p>
                        </div>
                        <div>
                            <p className="text-base text-black dark:text-white">
                                {document.description}
                            </p>
                        </div>
                        <div>
                            <PdfViewer url={document.document} />
                        </div>
                    </div>
                </Box>
            )}
        </MainLayout>
    )
}

export default withAuth(Documents)
