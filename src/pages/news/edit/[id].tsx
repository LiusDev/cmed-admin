import { Box, Breadcrumb, Button } from "@/components/common";
import CustomEditor from "@/components/customEditor";
import MainLayout from "@/components/layouts/MainLayout";
import type { News } from "@/types";
import { instance } from "@/utils";
import { InferGetServerSidePropsType } from "next";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { useRouter } from "next/router";
import React, { useState } from "react";

export const getServerSideProps = async ({ params }: { params: Params }) => {
    const res = await instance.get(`/news/${params.id}`);
    const news: News = await res.data;

    return {
        props: {
            news,
        },
    };
};

const Edit = ({
    news,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const [title, setTitle] = useState(news.title);
    const [value, setValue] = useState(news.content);

    const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const router = useRouter();

    const handlePublish = async () => {
        const res = await instance.patch(`/news/${news.id}`, {
            title,
            content: value,
        });
        if (res.status === 200) {
            router.push("/news");
        }
    };

    return (
        <MainLayout>
            <Breadcrumb pageName="News" link="news" />
            <Box className="max-w-230 m-auto">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">
                        Edit News
                    </h3>
                </div>
                <div className="flex flex-col gap-5.5 p-6.5">
                    <div>
                        <label className="mb-3 block text-black dark:text-white">
                            Title
                        </label>
                        <input
                            value={title}
                            onChange={handleChangeTitle}
                            type="text"
                            placeholder="News title"
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                    </div>
                    <div>
                        <CustomEditor value={value} onChange={setValue} />
                    </div>

                    <div>
                        <Button
                            onClick={handlePublish}
                            variant="rounded"
                            className="w-full"
                        >
                            Save & Publish
                        </Button>
                    </div>
                </div>
            </Box>
        </MainLayout>
    );
};

export default Edit;
