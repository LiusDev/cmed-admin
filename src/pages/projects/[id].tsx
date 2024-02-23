import { Box, Breadcrumb, Button } from "@/components/common"
import MainLayout from "@/components/layouts/MainLayout"
import type { Project } from "@/types"
import { convertDate, instance } from "@/utils"
import { useRouter } from "next/router"
import parse from "html-react-parser"
import { useEffect, useState } from "react"
import { TableSkeleton } from "@/components/skeletons"
import { Carousel } from "@mantine/carousel"
import withAuth from "@/hoc/withAuth"

const Project = () => {
    const [mounted, setMounted] = useState(false)
    const [projects, setProjects] = useState<Project | null>(null)
    let path: string
    const router = useRouter()
    useEffect(() => {
        path = window.location.pathname.split("/")[2]
        instance
            .get(`/projects/${path}`)
            .then((res) => {
                setMounted(true)
                setProjects(res.data)
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    window.location.href = "/signin"
                }
            })
    }, [])

    return (
        <MainLayout>
            <Breadcrumb pageName="Dự án" link="/projects">
                <Button
                    color="success"
                    variant="rounded"
                    size="large"
                    href={`/projects/edit/${router.query.id}`}
                >
                    Chỉnh sửa
                </Button>
            </Breadcrumb>
            {!projects ? (
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
                                {projects.name}
                            </h2>
                            <p>{convertDate(projects.createdAt)}</p>
                        </div>

                        <div>
                            <p className="text-base text-black dark:text-white">
                                {projects.description}
                            </p>
                        </div>
                        <div>
                            <img
                                src={projects.featuredImage}
                                alt={projects.name}
                            />
                        </div>
                        <div>
                            <h3 className="text-xl mb-4">Ảnh dự án</h3>
                            <Carousel
                                loop
                                height={300}
                                slideSize="33.333333333%"
                                slidesToScroll={3}
                            >
                                {projects.images.map((image) => (
                                    <Carousel.Slide key={image.id}>
                                        <img
                                            key={image.id}
                                            src={image.image}
                                            alt={projects.name}
                                            className="w-full object-cover object-center"
                                        />
                                    </Carousel.Slide>
                                ))}
                            </Carousel>
                        </div>

                        <div>{mounted && parse(projects.content)}</div>
                    </div>
                </Box>
            )}
        </MainLayout>
    )
}

export default withAuth(Project)
