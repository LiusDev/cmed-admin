import { Box, Breadcrumb, Button } from "@/components/common";
import MainLayout from "@/components/layouts/MainLayout";
import withAuth from "@/hoc/withAuth";
import type { News } from "@/types";
import { instance } from "@/utils";
import { InferGetServerSidePropsType } from "next";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { useRouter } from "next/router";
import parse from "html-react-parser";

export const getServerSideProps = async ({ params }: { params: Params }) => {
    const res = await instance.get(`/news/${params.id}`);
    const news: News = await res.data;

    return {
        props: {
            news,
        },
    };
};

const News = ({
    news,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const router = useRouter();
    return (
        <MainLayout title="News">
            <Breadcrumb pageName="News" link="/news">
                <Button
                    color="success"
                    variant="rounded"
                    size="large"
                    href={`/news/edit/${router.query.id}`}
                >
                    Edit
                </Button>
            </Breadcrumb>
            <Box className="max-w-230 m-auto">
                {/* <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">
                        Create News
                    </h3>
                </div> */}
                <div className="flex flex-col gap-5.5 p-6.5">
                    <div>
                        <h2 className="text-4xl font-semibold text-black dark:text-white">
                            {news.title}
                        </h2>
                    </div>
                    <div>
                        <p>{parse(news.content)}</p>
                    </div>
                </div>
            </Box>
        </MainLayout>
    );
};

export default News;
