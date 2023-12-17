import { Box, Button, Breadcrumb } from "@/components/common";
import { formats, modules } from "@/components/customEditor";
import MainLayout from "@/components/layouts/MainLayout";
import withAuth from "@/hoc/withAuth";
import { instance } from "@/utils";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Create = () => {
    const [title, setTitle] = useState("");
    const [value, setValue] = useState("");

    const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const QuillNoSSRWrapper = dynamic(import("react-quill"), {
        ssr: false,
    });

    const router = useRouter();

    const handlePublish = async () => {
        const res = await instance.post("/news", {
            title,
            content: value,
        });
        if (res.status === 201) {
            router.push("/news");
        }
    };

    return (
        <MainLayout>
            <Breadcrumb pageName="News" link="/news" />
            <Box className="max-w-230 m-auto">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">
                        Create News
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
                        <QuillNoSSRWrapper
                            theme="snow"
                            modules={modules}
                            formats={formats}
                            value={value}
                            onChange={setValue}
                        />
                    </div>

                    <div>
                        <Button
                            onClick={handlePublish}
                            variant="rounded"
                            className="w-full"
                        >
                            Publish
                        </Button>
                    </div>
                </div>
            </Box>
        </MainLayout>
    );
};

export default withAuth(Create);
