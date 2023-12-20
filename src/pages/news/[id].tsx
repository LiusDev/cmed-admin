import { Box, Breadcrumb, Button } from "@/components/common";
import MainLayout from "@/components/layouts/MainLayout";
import type { News } from "@/types";
import { convertDate, instance } from "@/utils";
import { useRouter } from "next/router";
import parse from "html-react-parser";
import { useEffect, useState } from "react";
import { TableSkeleton } from "@/components/skeletons";
import withAuth from "@/hoc/withAuth";

const News = () => {
    const [mounted, setMounted] = useState(false);
    const [news, setNews] = useState<News | null>(null);
    let path: string;
    const router = useRouter();
    useEffect(() => {
        path = window.location.pathname.split("/")[2];
        instance
            .get(`/news/${path}`)
            .then((res) => {
                setMounted(true);
                setNews(res.data);
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    window.location.href = "/signin";
                }
            });
    }, []);

    return (
        <MainLayout title="News">
            <Breadcrumb pageName="Bài viết" link="/news">
                <Button
                    color="success"
                    variant="rounded"
                    size="large"
                    href={`/news/edit/${router.query.id}`}
                >
                    Edit
                </Button>
            </Breadcrumb>
            {!news ? (
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
                                {news.title}
                            </h2>
                            <p>{convertDate(news.createdAt)}</p>
                        </div>
                        <div>
                            <p className="text-base text-black dark:text-white">
                                {news.description}
                            </p>
                        </div>
                        <div>
                            <img
                                src={news.featuredImage}
                                alt={news.title}
                                className="w-full object-cover"
                            />
                        </div>
                        <div>
                            <p>{mounted && parse(news.content)}</p>
                        </div>
                    </div>
                </Box>
            )}
        </MainLayout>
    );
};

export default withAuth(News);
