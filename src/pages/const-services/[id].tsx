import { Box, Breadcrumb, Button } from "@/components/common"
import MainLayout from "@/components/layouts/MainLayout"
import type { Service } from "@/types"
import { convertDate, instance } from "@/utils"
import { useRouter } from "next/router"
import parse from "html-react-parser"
import { useEffect, useState } from "react"
import { TableSkeleton } from "@/components/skeletons"
import withAuth from "@/hoc/withAuth"

const Service = () => {
    const [mounted, setMounted] = useState(false)
    const [service, setService] = useState<Service | null>(null)
    let path: string
    const router = useRouter()
    useEffect(() => {
        path = window.location.pathname.split("/")[2]
        instance
            .get(`/homeservices/${path}`)
            .then((res) => {
                setMounted(true)
                setService(res.data)
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    window.location.href = "/signin"
                }
            })
    }, [])

    return (
        <MainLayout title="Services">
            <Breadcrumb pageName="Dịch vụ" link="/homeservices">
                <Button
                    color="success"
                    variant="rounded"
                    size="large"
                    href={`/homeservices/edit/${router.query.id}`}
                >
                    Chỉnh sửa
                </Button>
            </Breadcrumb>
            {!service ? (
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
                                {service.name}
                            </h2>
                            <p>{convertDate(service.createdAt)}</p>
                        </div>
                        <div>
                            <p className="text-base text-black dark:text-white">
                                {service.description}
                            </p>
                        </div>
                        <div>
                            <img
                                src={service.featuredImage}
                                alt={service.name}
                                className="w-full object-cover"
                            />
                        </div>
                        <div>{mounted && parse(service.content)}</div>
                    </div>
                </Box>
            )}
        </MainLayout>
    )
}

export default withAuth(Service)
